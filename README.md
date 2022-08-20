# n8n-nodes-apprise

This is an n8n community node. It lets you use Apprise in your n8n workflows.

Apprise is a service that let's you send push notifications to just about every platform! 

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  <!-- delete if no auth needed -->  
[Compatibility](#compatibility)  
[Usage](#usage)  <!-- delete if not using this section -->  
[Resources](#resources)  
[Version history](#version-history)  <!-- delete if not using this section -->  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

This Apprise node allows you to send notifications via: 
- A `urls` parameter
- A configuration key
  - With optional tags

## Credentials

A simple Apprise credentials is needed for specifying the domain of the [Apprise API instance](https://github.com/caronc/apprise-api). No username or password are necessary. 

## Compatibility

Tested against n8n v 0.191.0.

## Usage

Given an [Apprise API instance](https://github.com/caronc/apprise-api) (configured through credentials), you are able to send out notifications to any Apprise-supported service. See [documentation here](https://github.com/caronc/apprise/wiki#notification-services) for how to connect to different services. 

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Apprise documentation](https://github.com/caronc/apprise)

## Version history

v0.1.0

Initial release! 
Supports sending notifications via an Apprise API instance leveraging either a `urls` parameter or a configure key with optional tags. 
