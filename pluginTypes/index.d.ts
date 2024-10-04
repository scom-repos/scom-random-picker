/// <amd-module name="@scom/scom-random-picker/formSchema.ts" />
declare module "@scom/scom-random-picker/formSchema.ts" {
    const _default: {
        dataSchema: {
            type: string;
            properties: {
                title: {
                    type: string;
                    label: string;
                };
                size: {
                    type: string;
                    minimum: number;
                };
                items: {
                    type: string;
                    items: {
                        type: string;
                        properties: {
                            value: {
                                type: string;
                                required: boolean;
                            };
                            icon: {
                                type: string;
                                format: string;
                                title: string;
                            };
                        };
                    };
                };
            };
        };
        uiSchema: {
            type: string;
            elements: ({
                type: string;
                scope: string;
                options?: undefined;
            } | {
                type: string;
                scope: string;
                options: {
                    detail: {
                        type: string;
                    };
                };
            })[];
        };
    };
    export default _default;
}
/// <amd-module name="@scom/scom-random-picker/data.json.ts" />
declare module "@scom/scom-random-picker/data.json.ts" {
    const _default_1: {
        defaultBuilderData: {
            size: number;
            items: {
                value: string;
            }[];
        };
    };
    export default _default_1;
}
/// <amd-module name="@scom/scom-random-picker/model.ts" />
declare module "@scom/scom-random-picker/model.ts" {
    import { Module } from '@ijstech/components';
    export const colors: string[];
    export interface IWheelPickerData {
        title?: string;
        items: {
            value: string;
            icon?: string;
        }[];
        size?: number;
    }
    export class Model {
        private _data;
        private module;
        renderWheelPicker: () => void;
        constructor(module: Module);
        get title(): string;
        get size(): number;
        get items(): {
            value: string;
            icon?: string;
        }[];
        getConfigurators(): {
            name: string;
            target: string;
            getActions: (category?: string) => any[];
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
        }[];
        setData(value: IWheelPickerData): Promise<void>;
        getData(): IWheelPickerData;
        getTag(): any;
        setTag(value: any): void;
        private updateTag;
        private updateStyle;
        private updateTheme;
        private _getActions;
        getChoosenItem(deg: number): {
            value: string;
            icon?: string;
        };
    }
}
/// <amd-module name="@scom/scom-random-picker/index.css.ts" />
declare module "@scom/scom-random-picker/index.css.ts" {
    export const spinActionStyle: string;
    export const markerStyle: string;
    export const wheelStyle: string;
    export const itemStyle: string;
    export const textCenterStyle: string;
}
/// <amd-module name="@scom/scom-random-picker" />
declare module "@scom/scom-random-picker" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    interface ScomRandomPickerElement extends ControlElement {
        title?: string;
        items?: {
            value: string;
            icon?: string;
        }[];
        size?: number;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-random-picker']: ScomRandomPickerElement;
            }
        }
    }
    export default class ScomRandomPicker extends Module {
        private model;
        private wheelContainer;
        private lbTitle;
        private pnlItems;
        private btnSpin;
        private pnlMarker;
        private lbEmpty;
        private mdResult;
        private imgResult;
        private lbResult;
        private btnRemove;
        private currentDeg;
        tag: any;
        static create(options?: ScomRandomPickerElement, parent?: Container): Promise<ScomRandomPicker>;
        get title(): string;
        get size(): number;
        get items(): {
            value: string;
            icon?: string;
        }[];
        getConfigurators(): {
            name: string;
            target: string;
            getActions: (category?: string) => any[];
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
        }[];
        setData(value: any): Promise<void>;
        getData(): import("@scom/scom-random-picker/model.ts").IWheelPickerData;
        getTag(): any;
        setTag(value: any): void;
        private initModel;
        private renderWheelPicker;
        private resizeWheelPicker;
        private handleSpin;
        private handleRemoveChoice;
        private handleCloseModal;
        init(): Promise<void>;
        render(): any;
    }
}
