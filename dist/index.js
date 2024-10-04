var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-random-picker/formSchema.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-random-picker/formSchema.ts'/> 
    exports.default = {
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
    };
});
define("@scom/scom-random-picker/data.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-random-picker/data.json.ts'/> 
    exports.default = {
        "defaultBuilderData": {
            size: 480,
            items: [
                {
                    value: 'OSWAP'
                },
                {
                    value: 'USDT'
                },
                {
                    value: 'BUSD'
                },
                {
                    value: 'IF'
                }
            ]
        }
    };
});
define("@scom/scom-random-picker/model.ts", ["require", "exports", "@scom/scom-random-picker/formSchema.ts", "@scom/scom-random-picker/data.json.ts"], function (require, exports, formSchema_1, data_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Model = exports.colors = void 0;
    const SIZE = 480;
    exports.colors = ['#afa939', '#2b580c', '#ff0000', '#800080', '#FFA500'];
    class Model {
        constructor(module) {
            this._data = { items: [], size: SIZE };
            this.module = module;
        }
        get title() {
            return this._data.title || '';
        }
        get size() {
            const smallerDimension = (innerWidth > innerHeight ? innerHeight : innerWidth) - 32;
            const _size = this._data.size || SIZE;
            return _size > smallerDimension ? smallerDimension : _size;
        }
        get items() {
            return this._data.items || [];
        }
        getConfigurators() {
            return [
                {
                    name: 'Builder Configurator',
                    target: 'Builders',
                    getActions: () => {
                        return this._getActions();
                    },
                    getData: this.getData.bind(this),
                    setData: async (value) => {
                        const defaultData = data_json_1.default.defaultBuilderData;
                        this.setData({ ...defaultData, ...value });
                    },
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                },
                {
                    name: 'Editor',
                    target: 'Editor',
                    getActions: (category) => {
                        const actions = this._getActions();
                        const editAction = actions.find(action => action.name === 'Edit');
                        return editAction ? [editAction] : [];
                    },
                    getData: this.getData.bind(this),
                    setData: this.setData.bind(this),
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                }
            ];
        }
        async setData(value) {
            this._data = value;
            this.renderWheelPicker();
        }
        getData() {
            return this._data;
        }
        getTag() {
            return this.module.tag;
        }
        setTag(value) {
            const newValue = value || {};
            for (let prop in newValue) {
                if (newValue.hasOwnProperty(prop)) {
                    if (prop === 'light' || prop === 'dark')
                        this.updateTag(prop, newValue[prop]);
                    else
                        this.module.tag[prop] = newValue[prop];
                }
            }
            this.updateTheme();
        }
        updateTag(type, value) {
            this.module.tag[type] = this.module.tag[type] ?? {};
            for (let prop in value) {
                if (value.hasOwnProperty(prop))
                    this.module.tag[type][prop] = value[prop];
            }
        }
        updateStyle(name, value) {
            if (value) {
                this.module.style.setProperty(name, value);
            }
            else {
                this.module.style.removeProperty(name);
            }
        }
        updateTheme() {
            const themeVar = document.body.style.getPropertyValue('--theme') || 'light';
            this.updateStyle('--text-primary', this.module.tag[themeVar]?.fontColor);
            this.updateStyle('--background-main', this.module.tag[themeVar]?.backgroundColor);
        }
        _getActions() {
            const actions = [];
            actions.push({
                name: 'Edit',
                icon: 'edit',
                userInputDataSchema: formSchema_1.default.dataSchema,
                userInputUISchema: formSchema_1.default.uiSchema,
            });
            return actions;
        }
        getChoosenItem(deg) {
            const length = this.items.length;
            const idx = (Math.ceil(((deg - 90) % 360) / (360 / length) + 0.5) - 1) % length;
            return this.items[idx];
        }
    }
    exports.Model = Model;
});
define("@scom/scom-random-picker/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.textCenterStyle = exports.itemStyle = exports.wheelStyle = exports.markerStyle = exports.spinActionStyle = void 0;
    const Theme = components_1.Styles.Theme.ThemeVars;
    exports.spinActionStyle = components_1.Styles.style({
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '5rem',
        height: '5rem',
        display: 'flex',
        border: 0,
        borderRadius: '50%',
        fontSize: '1rem',
        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
        outline: 'none',
        background: Theme.colors.primary.main,
        $nest: {
            '&.disabled': {
                background: Theme.colors.primary.main,
                opacity: 1
            }
        }
    });
    exports.markerStyle = components_1.Styles.style({
        width: '3rem',
        height: '3rem',
        clipPath: 'polygon(50% 0, 100% 50%, 0 50%)',
        background: Theme.colors.primary.main,
        position: 'absolute',
        top: 'calc(50% - 40px)',
        left: '50%',
        transform: 'translate(-50%, calc(-50% + 8px))',
        cursor: 'pointer',
        $nest: {
            '&.disabled': {
                opacity: 1,
                cursor: 'not-allowed'
            }
        }
    });
    exports.wheelStyle = components_1.Styles.style({
        height: '100%',
        position: 'relative',
        borderRadius: '50%',
        overflow: 'hidden',
        transition: 'transform 3s ease'
    });
    exports.itemStyle = components_1.Styles.style({
        width: '50%',
        position: 'absolute',
        transformOrigin: 'center right'
    });
    exports.textCenterStyle = components_1.Styles.style({
        textAlign: 'center'
    });
});
define("@scom/scom-random-picker", ["require", "exports", "@ijstech/components", "@scom/scom-random-picker/model.ts", "@scom/scom-random-picker/index.css.ts"], function (require, exports, components_2, model_1, index_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_2.Styles.Theme.ThemeVars;
    let ScomRandomPicker = class ScomRandomPicker extends components_2.Module {
        constructor() {
            super(...arguments);
            this.currentDeg = 0;
            this.tag = {};
        }
        static async create(options, parent) {
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
        async setData(value) {
            this.model.setData(value);
        }
        getData() {
            return this.model.getData();
        }
        getTag() {
            return this.tag;
        }
        setTag(value) {
            this.model.setTag(value);
        }
        initModel() {
            if (!this.model) {
                this.model = new model_1.Model(this);
                this.model.renderWheelPicker = this.renderWheelPicker.bind(this);
            }
        }
        renderWheelPicker() {
            this.lbTitle.title = this.title;
            this.lbTitle.visible = !!this.title;
            this.wheelContainer.width = this.size;
            this.wheelContainer.height = this.size;
            const length = this.items.length;
            if (length > 1) {
                const nodeItems = [];
                const degPerPart = 360 / length;
                for (let i = 0; i < length; i++) {
                    const item = this.items[i];
                    const pnl = new components_2.Panel();
                    pnl.classList.add(index_css_1.itemStyle);
                    let itemColor = model_1.colors[i % model_1.colors.length];
                    if (i === (length - 1) && !(i % model_1.colors.length)) {
                        itemColor = model_1.colors[1];
                    }
                    pnl.background = { color: itemColor };
                    const stack = new components_2.HStack(pnl, {
                        gap: '0.25rem',
                        verticalAlignment: 'center',
                        width: '100%',
                        height: '100%',
                        padding: { right: '40px', left: '5%' }
                    });
                    if (item.icon) {
                        new components_2.Image(stack, {
                            width: '32px',
                            maxWidth: '50%',
                            height: 'auto',
                            url: item.icon
                        });
                    }
                    new components_2.Label(stack, {
                        caption: item.value,
                        overflow: 'hidden'
                    });
                    if (length === 2) {
                        pnl.height = '100%';
                        pnl.style.transform = 'rotate(' + (i * degPerPart) + 'deg)';
                    }
                    else {
                        pnl.height = Math.tan((degPerPart / 2) * Math.PI / 180) * 100 + '%';
                        pnl.top = '50%';
                        pnl.style.transform = 'translateY(-50%) rotate(' + (i * degPerPart * -1) + 'deg)';
                        pnl.style.clipPath = 'polygon(0 0, 0 100%, 100% 50%)';
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
            }
            else {
                this.wheelContainer.visible = false;
                this.lbEmpty.visible = true;
            }
        }
        resizeWheelPicker() {
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
        handleSpin() {
            this.currentDeg += Math.floor(Math.random() * 360) + 360 * 5;
            this.pnlItems.style.transform = 'rotate(' + this.currentDeg + 'deg)';
            this.btnSpin.enabled = false;
            this.pnlMarker.enabled = false;
            setTimeout(() => {
                const item = this.model.getChoosenItem(this.currentDeg);
                this.btnSpin.enabled = true;
                this.pnlMarker.enabled = true;
                this.lbResult.caption = item.value;
                if (item.icon) {
                    this.imgResult.visible = true;
                    this.imgResult.url = item.icon;
                }
                else {
                    this.imgResult.visible = false;
                }
                this.btnRemove.visible = this.items.length > 2;
                this.mdResult.visible = true;
            }, 3000);
        }
        handleRemoveChoice() {
            if (this.items.length > 2) {
                const choosenItem = this.model.getChoosenItem(this.currentDeg);
                const idx = this.items.findIndex(v => v.value === choosenItem.value);
                this.items.splice(idx, 1);
                this.mdResult.visible = false;
                this.renderWheelPicker();
            }
        }
        handleCloseModal() {
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
            window.addEventListener('resize', () => { this.resizeWheelPicker(); });
        }
        render() {
            return (this.$render("i-vstack", { alignItems: "center", padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' } },
                this.$render("i-label", { id: "lbTitle", caption: "Picker Wheel", font: { size: '1.25rem', bold: true, color: Theme.colors.primary.main }, margin: { bottom: '1rem' } }),
                this.$render("i-panel", { id: "wheelContainer", width: "20rem", height: "20rem", border: { radius: '50%' }, boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px", overflow: "hidden", visible: false },
                    this.$render("i-panel", { id: "pnlItems", class: index_css_1.wheelStyle }),
                    this.$render("i-panel", { height: "100%", width: "100%", top: 0, position: "absolute" },
                        this.$render("i-button", { id: "btnSpin", caption: "Spin", font: { bold: true }, class: index_css_1.spinActionStyle, onClick: this.handleSpin }),
                        this.$render("i-panel", { id: "pnlMarker", class: index_css_1.markerStyle, onClick: this.handleSpin }))),
                this.$render("i-label", { id: "lbEmpty", caption: "No Items", class: index_css_1.textCenterStyle }),
                this.$render("i-modal", { id: "mdResult", title: "Result", width: "100%", maxWidth: 400, visible: false },
                    this.$render("i-vstack", { gap: "0.5rem", verticalAlignment: "center", alignItems: "center", padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' } },
                        this.$render("i-image", { id: "imgResult", width: 64, height: "auto", maxWidth: "60%" }),
                        this.$render("i-label", { id: "lbResult", font: { size: '2rem', bold: true, color: Theme.colors.primary.main } }),
                        this.$render("i-hstack", { gap: "1rem", margin: { top: '2rem' }, verticalAlignment: "center", horizontalAlignment: "center", wrap: "wrap" },
                            this.$render("i-button", { id: "btnRemove", width: 120, height: 32, caption: "Remove Choice", border: { radius: 5 }, padding: { top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem' }, background: { color: Theme.colors.secondary.main }, font: { color: Theme.colors.secondary.contrastText }, onClick: this.handleRemoveChoice }),
                            this.$render("i-button", { width: 120, height: 32, caption: "Done", border: { radius: 5 }, padding: { top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem' }, font: { color: Theme.colors.primary.contrastText }, onClick: this.handleCloseModal }))))));
        }
    };
    ScomRandomPicker = __decorate([
        (0, components_2.customElements)('i-scom-random-picker')
    ], ScomRandomPicker);
    exports.default = ScomRandomPicker;
});
