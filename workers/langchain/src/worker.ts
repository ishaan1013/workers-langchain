import { SequentialChain, LLMChain } from 'langchain/chains';
import { OpenAI } from 'langchain/llms/openai';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { PromptTemplate } from 'langchain/prompts';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { SerpAPI } from 'langchain/tools';
import { Calculator } from 'langchain/tools/calculator';
import { z } from 'zod';

export interface Env {}

const bodySchema = z.object({
	fromLocation: z.string(),
	description: z.string(),
	openai: z.string(),
	serp: z.string(),
});

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if (request.method !== 'POST') {
			return new Response('Method not allowed', { status: 405 });
		}

		const body = await request.json();

		const parsed = bodySchema.safeParse(body);
		if (!parsed.success) {
			return new Response('Invalid body', { status: 400 });
		}
		const { fromLocation, description, openai, serp } = parsed.data;

		const model = new OpenAI({ temperature: 0, openAIApiKey: openai });
		const chat = new ChatOpenAI({
			temperature: 0,
			modelName: 'gpt-3.5-turbo-0613',
			openAIApiKey: openai,
		});

		const template = `You are an expert travel planning agent. Given a description of a client's desired vacation, it is your job to provide them with exactly one ideal location in the world to visit.

		Return only the location, without an explanation or anything else.

		Here is a description of a client's desired vacation:
		{description}
		`;
		const promptTemplate = new PromptTemplate({
			template,
			inputVariables: ['description'],
		});
		const locationChain = new LLMChain({
			llm: model,
			prompt: promptTemplate,
			outputKey: 'location',
		});

		const itineraryTemplate = `You are an expert travel planning agent. Given the location of a client's desired vacation, it is your job to provide them with an itinerary for one week.

		Here is the location of your client's vacation:
		{location}`;
		const itineraryPromptTemplate = new PromptTemplate({
			template: itineraryTemplate,
			inputVariables: ['location'],
		});
		const itineraryChain = new LLMChain({
			llm: model,
			prompt: itineraryPromptTemplate,
			outputKey: 'itinerary',
		});

		const overallChain = new SequentialChain({
			chains: [locationChain, itineraryChain],
			inputVariables: ['description'],
			outputVariables: ['location', 'itinerary'],
			verbose: true,
		});
		const chainExecutionResult = await overallChain.call({
			description,
		});

		const tools = [
			new SerpAPI(serp, {
				hl: 'en',
				gl: 'us',
			}),
			new Calculator(),
		];

		const executor = await initializeAgentExecutorWithOptions(tools, chat, {
			agentType: 'openai-functions',
			verbose: true,
		});

		const result = await executor.call({
			input: `What is the current flight price from ${fromLocation} to ${chainExecutionResult.location}? Do not return additional explanations or anything.`,
		});

		return new Response(JSON.stringify({ ...chainExecutionResult, flight: result.output }));
	},
};
