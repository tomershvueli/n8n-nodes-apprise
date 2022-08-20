import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { OptionsWithUri } from 'request-promise-native';

type AppriseApi = {
	domain: string;
};

type NotifyPayload = {
	body: string,
	title: string,
	type: string,
	urls?: string
};

export class Apprise implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Apprise',
		name: 'apprise',
		icon: 'file:apprise.svg',
		group: ['transform'],
		version: 1,
		description: 'Send notifications through an Apprise API instance',
		defaults: {
			name: 'Apprise',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'appriseApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				placeholder: 'Notification Title',
				description: 'The title of the notifications',
			},
			{
				displayName: 'Body',
				name: 'body',
				type: 'string',
				default: '',
				placeholder: 'Notification Body',
				description: 'The body of the notifications',
				required: true,
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				default: 'info',
				description: 'The type of notifications',
				options: [
					{
						name: 'Info',
						value: 'info',
					},
					{
						name: 'Success',
						value: 'success',
					},
					{
						name: 'Warning',
						value: 'warning',
					},
					{
						name: 'Failure',
						value: 'failure',
					},
				],
			},
			{
				displayName: 'Use Key?',
				name: 'useKey',
				type: 'boolean',
				default: false,
				description: 'Whether you want to notify using a persistent store key',
			},
			{
				displayName: 'URLs',
				name: 'urls',
				type: 'string',
				default: '',
				placeholder: 'URLs',
				description: 'A comma or space-separated list of URL\'s to send the notification to',
				required: true,
				displayOptions: {
					hide: {
						'useKey': [
							true,
						],
					},
				},
			},
			{
				displayName: 'Key',
				name: 'key',
				type: 'string',
				default: '',
				placeholder: 'Key',
				description: 'The configuration key',
				required: true,
				displayOptions: {
					show: {
						'useKey': [
							true,
						],
					},
				},
			},
			{
				displayName: 'Tag',
				name: 'tag',
				type: 'string',
				default: '',
				placeholder: 'Tag',
				description: 'Comma-separated list of tags',
				displayOptions: {
					show: {
						'useKey': [
							true,
						],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		const credentials = (await this.getCredentials('appriseApi')) as AppriseApi;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const body   = this.getNodeParameter('body', itemIndex, 'Notification body') as string;
				const title  = this.getNodeParameter('title', itemIndex) as string;
				const type   = this.getNodeParameter('type', itemIndex, 'info') as string;
				const urls   = this.getNodeParameter('urls', itemIndex, '') as string;
				const useKey = this.getNodeParameter('useKey', itemIndex, false) as boolean;
				const key    = this.getNodeParameter('key', itemIndex, '') as string;
				const tag    = this.getNodeParameter('tag', itemIndex, '') as string;

				const payload: NotifyPayload = {
					body,
					title,
					type,
				};

				let uri = `${credentials.domain}/notify/`;
				if (useKey) {
					uri += `${key}`;
				} else {
					payload.urls = urls;
				}
				if (tag) {
					uri += `?tag=${tag}`;
				}

				const options: OptionsWithUri = {
					headers: {
						'Content-Type': 'application/json',
					},
					method: 'POST',
					body: JSON.stringify(payload),
					uri,
					json: true,
				};

				await this.helpers.request!(options);
			} catch (error) {
				// This node should never fail but we want to showcase how
				// to handle errors.
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					// Adding `itemIndex` allows other workflows to handle this error
					if (error.context) {
						// If the error thrown already contains the context property,
						// only append the itemIndex
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return this.prepareOutputData(items);
	}
}
