import { Module, customModule, Container, Modal } from '@ijstech/components';
import ScomRandomPicker from '@scom/scom-random-picker';
import ScomWidgetTest from '@scom/scom-widget-test';

@customModule
export default class Module1 extends Module {
    private randomPicker: ScomRandomPicker;
    private widgetModule: ScomWidgetTest;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    private async onShowConfig() {
        const editor = this.randomPicker.getConfigurators().find(v => v.target === 'Editor');
        const widgetData = await editor.getData();
        if (!this.widgetModule) {
            this.widgetModule = await ScomWidgetTest.create({
                widgetName: 'scom-random-picker',
                onConfirm: (data: any, tag: any) => {
                    editor.setData(data);
                    editor.setTag(tag);
                    this.widgetModule.closeModal();
                }
            });
        }
        this.widgetModule.openModal({
            width: '90%',
            maxWidth: '90rem',
            padding: { top: 0, bottom: 0, left: 0, right: 0 },
            closeOnBackdropClick: true,
            closeIcon: null
        });
        this.widgetModule.show(widgetData);

        setTimeout(() => {
            (this.widgetModule.closest('i-modal') as Modal)?.refresh();
        }, 1);
    }

    init() {
        super.init();
    }

    render() {
        return (
            <i-vstack
                margin={{ top: '1rem', left: '1rem', right: '1rem' }}
                gap="1rem"
            >
                <i-button caption="Config" onClick={this.onShowConfig} width={160} padding={{ top: 5, bottom: 5 }} margin={{ left: 'auto', right: 20 }} font={{ color: '#fff' }} />
                <i-scom-random-picker
                    id="randomPicker"
                    items={
                        [
                            {
                                name: 'OSWAP',
                                weight: 1
                            },
                            {
                                name: 'USDT',
                                weight: 2
                            },
                            {
                                name: 'BUSD',
                                weight: 1
                            },
                            {
                                name: 'IF',
                                weight: 1
                            }
                        ]
                    }
                />
            </i-vstack>
        )
    }
}