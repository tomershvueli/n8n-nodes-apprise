import {
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AppriseApi implements ICredentialType {
	name = 'appriseApi';
	displayName = 'Apprise Instance API';
	documentationUrl = 'https://github.com/caronc/apprise';
	properties: INodeProperties[] = [
		{
			displayName: 'Domain',
			name: 'domain',
			type: 'string',
			default: 'https://apprise.org',
		},
	];

	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials?.domain}}',
			url: '/',
		},
	};
}
