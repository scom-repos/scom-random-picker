export default {
    dataSchema: {
        type: 'object',
        properties: {
            title: {
                type: 'string',
                label: 'Title'
            },
            size: {
                type: 'number',
                minimum: 100
            },
            rewards: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            required: true
                        },
                        icon: {
                            type: 'string',
                            format: 'data-url',
                            title: 'Prize icon'
                        },
                        weight: {
                            type: 'number',
                            default: 1,
                            minimum: 1
                        }
                    }
                }
            }
        }
    },
    uiSchema: {
        type: 'VerticalLayout',
        elements: [
            {
                type: 'Control',
                scope: '#/properties/title'
            },
            {
                type: 'Control',
                scope: '#/properties/size'
            },
            {
                type: 'Control',
                scope: '#/properties/rewards',
                options: {
                    detail: {
                        type: 'VerticalLayout'
                    }
                }
            }
        ]
    }
}