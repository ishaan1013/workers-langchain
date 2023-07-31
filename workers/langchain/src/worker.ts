import { SequentialChain, LLMChain } from 'langchain/chains';
import { OpenAI } from 'langchain/llms/openai';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { PromptTemplate } from 'langchain/prompts';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { SerpAPI } from 'langchain/tools';
import { Calculator } from 'langchain/tools/calculator';
import { z } from 'zod';

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}

const bodySchema = z.object({
	description: z.string(),
	openai: z.string(),
	serp: z.string(),
});

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// if (request.method !== 'POST') {
		// 	return new Response('Method not allowed', { status: 405 });
		// }

		// const body = await request.json();

		// const parsed = bodySchema.safeParse(body);
		// if (!parsed.success) {
		// 	return new Response('Invalid body', { status: 400 });
		// }
		// const { description, openai, serp } = parsed.data;

		const fromLocation = 'New York City';

		const openai = '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';
		const serp = '9a520a51aafa69ebf94a5ffb55cd523c334dd6e190e4446e0b2ab4ef278ca245';

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

		// This is an LLMChain to write a review of a play given a synopsis.
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
			description: 'I want to go to a beach in the Caribbean with white sand and excellent snorkeling.',
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

		return new Response(JSON.stringify({ ...chainExecutionResult, result }));
	},
};
