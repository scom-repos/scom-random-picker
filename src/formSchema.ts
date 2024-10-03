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
            items: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        value: {
                            type: 'string',
                            required: true
                        },
                        icon: {
                            type: 'string',
                            format: 'data-url',
                            title: 'Prize icon'
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
                scope: '#/properties/items',
                options: {
                    detail: {
                        type: 'VerticalLayout'
                    }
                }
            }
        ]
    }
}