import {
    Module,
    Container,
    ControlElement,
    customElements,
    Panel,
    Styles,
    Button,
    Label,
    Image,
    Modal,
    HStack
} from '@ijstech/components';
import { colors, IItem, Model } from './model';
import { itemStyle, markerStyle, spinActionStyle, textCenterStyle, wheelStyle } from './index.css';
const Theme = Styles.Theme.ThemeVars;
const MAX_HEIGHT = 1000;

interface ScomRandomPickerElement extends ControlElement {
    title?: string;
    items?: IItem[];
    size?: number;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-random-picker']: ScomRandomPickerElement;
        }
    }
}

@customElements('i-scom-random-picker')
export default class ScomRandomPicker extends Module {
    private model: Model;
    private wheelContainer: Panel;
    private lbTitle: Label;
    private pnlItems: Panel;
    private btnSpin: Button;
    private pnlMarker: Panel;
    private lbEmpty: Label;
    private mdResult: Modal;
    private imgResult: Image;
    private lbResult: Label;
    private btnRemove: Button;

    tag: any = {};

    static async create(options?: ScomRandomPickerElement, parent?: Container) {
        let self = new this(parent, options);
        await self.ready();
        return self;
    }

    get title() {
        return this.model.title;
    }

    get size() {
        return this.model.size;
    }

    get items() {
        return this.model.items;
    }

    getConfigurators() {
        this.initModel();
        return this.model.getConfigurators();
    }

    async setData(value: any) {
        this.model.setData(value);
    }

    getData() {
        return this.model.getData();
    }

    getTag() {
        return this.tag;
    }

    setTag(value: any) {
        this.model.setTag(value);
    }

    private initModel() {
        if (!this.model) {
            this.model = new Model(this);
            this.model.renderWheelPicker = this.renderWheelPicker.bind(this);
        }
    }

    private renderWheelPicker() {
        this.lbTitle.title = this.title;
        this.lbTitle.visible = !!this.title;
        this.wheelContainer.width = this.size;
        this.wheelContainer.height = this.size;

        const length = this.items.length;
        if (length > 1) {
            const nodeItems: HTMLElement[] = [];
            const degPerPart = 360 / this.model.totalWeight;
            let removedDeg = 0;
            for (let i = 0; i < length; i++) {
                const { name, weight, icon } = this.items[i];
                const _weight = (weight || 1);
                const deg = degPerPart * _weight;
                const pnl = new Panel();
                pnl.classList.add(itemStyle);
                let itemColor = colors[i % colors.length];
                if (i === (length - 1) && !(i % colors.length)) {
                    itemColor = colors[1];
                }
                pnl.background = { color: itemColor };
                const stack = new HStack(pnl, {
                    gap: '0.25rem',
                    verticalAlignment: 'center',
                    width: '100%',
                    height: '100%',
                    padding: { right: '40px', left: '5%' }
                });
                if (icon) {
                    new Image(stack, {
                        width: '32px',
                        maxWidth: '50%',
                        height: 'auto',
                        url: icon
                    });
                }
                new Label(stack, {
                    caption: name,
                    overflow: 'hidden'
                });
                if (length === 2 && this.items[0].weight === this.items[1].weight) {
                    pnl.height = '100%';
                    pnl.style.transform = 'rotate(' + (i * deg) + 'deg)';
                } else {
                    const addedDeg = i === 0 ? 0 : (degPerPart / 2) * (1 - _weight);
                    const height = Math.tan((deg / 2) * Math.PI / 180) * 100;
                    if (height > MAX_HEIGHT || height < 0) {
                        pnl.height = MAX_HEIGHT + '%';
                        pnl.width = '100%';
                        pnl.zIndex = 0;
                        pnl.style.transformOrigin = 'center';
                    } else {
                        pnl.height = height + '%';
                    }
                    pnl.top = '50%';
                    pnl.style.transform = 'translateY(-50%) rotate(' + (addedDeg - (i * degPerPart) - removedDeg) + 'deg)';
                    pnl.style.clipPath = 'polygon(0 0, 0 100%, 100% 50%)';
                    const degPerWeight = i === 0 ? degPerPart / 2 : degPerPart;
                    removedDeg = removedDeg + ((_weight - 1) * degPerWeight);
                }
                nodeItems.push(pnl);
            }
            this.pnlItems.clearInnerHTML();
            this.pnlItems.append(...nodeItems);
            this.wheelContainer.visible = true;
            this.btnSpin.enabled = true;
            this.lbEmpty.visible = false;
            this.btnRemove.visible = length > 2;
            this.resizeWheelPicker();
        } else {
            this.wheelContainer.visible = false;
            this.lbEmpty.visible = true;
        }
    }

    private resizeWheelPicker() {
        const clientRect = this.parentElement?.getBoundingClientRect();
        let size = this.model.size;
        if (clientRect) {
            const { width, height } = clientRect;
            const value = (width > height ? height : width) - 32;
            size = value > this.model.size ? this.model.size : value;
        }
        this.wheelContainer.width = size;
        this.wheelContainer.height = size;
    }

    private handleSpin() {
        const { item, deg } = this.model.handleSpin();
        this.pnlItems.style.transform = 'rotate(' + deg + 'deg)';
        this.btnSpin.enabled = false;
        this.pnlMarker.enabled = false;
        setTimeout(() => {
            this.btnSpin.enabled = true;
            this.pnlMarker.enabled = true;
            this.lbResult.caption = item.name;
            if (item.icon) {
                this.imgResult.visible = true;
                this.imgResult.url = item.icon;
            } else {
                this.imgResult.visible = false;
            }
            this.btnRemove.visible = this.items.length > 2;
            this.mdResult.visible = true;
        }, 3000);
    }

    private handleRemoveChoice() {
        if (this.items.length > 2) {
            const choosenItem = this.model.currentItem;
            const idx = this.items.findIndex(v => v.name === choosenItem.name);
            this.items.splice(idx, 1);
            this.mdResult.visible = false;
            this.renderWheelPicker();
        }
    }

    private handleCloseModal() {
        this.mdResult.visible = false;
    }

    async init() {
        this.initModel();
        super.init();
        const lazyLoad = this.getAttribute('lazyLoad', true, false);
        if (!lazyLoad) {
            const title = this.getAttribute('title', true);
            const size = this.getAttribute('size', true);
            const items = this.getAttribute('items', true);
            if (items) {
                this.setData({ title, size, items });
            }
        }

        window.addEventListener('resize', () => { this.resizeWheelPicker() });
    }

    render() {
        return (
            <i-vstack alignItems="center" padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}>
                <i-label
                    id="lbTitle"
                    caption="Picker Wheel"
                    font={{ size: '1.25rem', bold: true, color: Theme.colors.primary.main }}
                    margin={{ bottom: '1rem' }}
                />
                <i-panel
                    id="wheelContainer"
                    width="20rem"
                    height="20rem"
                    border={{ radius: '50%' }}
                    boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
                    overflow="hidden"
                    visible={false}
                >
                    <i-panel id="pnlItems" class={wheelStyle} />
                    <i-panel
                        height="100%"
                        width="100%"
                        top={0}
                        position="absolute"
                    >
                        <i-button
                            id="btnSpin"
                            caption="Spin"
                            font={{ bold: true }}
                            class={spinActionStyle}
                            onClick={this.handleSpin}
                        />
                        <i-panel id="pnlMarker" class={markerStyle} onClick={this.handleSpin} />
                    </i-panel>
                </i-panel>
                <i-label id="lbEmpty" caption="No Items" class={textCenterStyle} />

                <i-modal
                    id="mdResult"
                    title="Result"
                    width="100%"
                    maxWidth={400}
                    visible={false}
                >
                    <i-vstack gap="0.5rem" verticalAlignment="center" alignItems="center" padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}>
                        <i-image id="imgResult" width={64} height="auto" maxWidth="60%" />
                        <i-label id="lbResult" font={{ size: '2rem', bold: true, color: Theme.colors.primary.main }} />
                        <i-hstack gap="1rem" margin={{ top: '2rem' }} verticalAlignment="center" horizontalAlignment="center" wrap="wrap">
                            <i-button
                                id="btnRemove"
                                width={120}
                                height={32}
                                caption="Remove Choice"
                                border={{ radius: 5 }}
                                padding={{ top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem' }}
                                background={{ color: Theme.colors.secondary.main }}
                                font={{ color: Theme.colors.secondary.contrastText }}
                                onClick={this.handleRemoveChoice}
                            />
                            <i-button
                                width={120}
                                height={32}
                                caption="Done"
                                border={{ radius: 5 }}
                                padding={{ top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem' }}
                                font={{ color: Theme.colors.primary.contrastText }}
                                onClick={this.handleCloseModal}
                            />
                        </i-hstack>
                    </i-vstack>
                </i-modal>
            </i-vstack>
        )
    }
}