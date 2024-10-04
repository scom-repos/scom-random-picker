import { Module } from '@ijstech/components';
import formSchema from './formSchema';
import configData from './data.json';
const SIZE = 480;
export const colors = ['#afa939', '#2b580c', '#ff0000', '#800080', '#FFA500'];

export interface IWheelPickerData {
  title?: string;
  items: { value: string; icon?: string }[];
  size?: number;
}

export class Model {
  private _data: IWheelPickerData = { items: [], size: SIZE };
  private module: Module;
  renderWheelPicker: () => void;

  constructor(module: Module) {
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
        setData: async (value: any) => {
          const defaultData = configData.defaultBuilderData;
          this.setData({ ...defaultData, ...value });
        },
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      },
      {
        name: 'Editor',
        target: 'Editor',
        getActions: (category?: string) => {
          const actions = this._getActions();
          const editAction = actions.find(action => action.name === 'Edit');
          return editAction ? [editAction] : [];
        },
        getData: this.getData.bind(this),
        setData: this.setData.bind(this),
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      }
    ]
  }

  async setData(value: IWheelPickerData) {
    this._data = value;
    this.renderWheelPicker();
  }

  getData() {
    return this._data;
  }

  getTag() {
    return this.module.tag;
  }

  setTag(value: any) {
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

  private updateTag(type: 'light' | 'dark', value: any) {
    this.module.tag[type] = this.module.tag[type] ?? {};
    for (let prop in value) {
      if (value.hasOwnProperty(prop))
        this.module.tag[type][prop] = value[prop];
    }
  }

  private updateStyle(name: string, value: any) {
    if (value) {
      this.module.style.setProperty(name, value);
    } else {
      this.module.style.removeProperty(name);
    }
  }

  private updateTheme() {
    const themeVar = document.body.style.getPropertyValue('--theme') || 'light';
    this.updateStyle('--text-primary', this.module.tag[themeVar]?.fontColor);
    this.updateStyle('--background-main', this.module.tag[themeVar]?.backgroundColor);
  }

  private _getActions() {
    const actions = [];
    actions.push({
      name: 'Edit',
      icon: 'edit',
      userInputDataSchema: formSchema.dataSchema,
      userInputUISchema: formSchema.uiSchema,
    });
    return actions;
  }

  getChoosenItem(deg: number) {
    const length = this.items.length;
    const idx = (Math.ceil(((deg - 90) % 360) / (360 / length) + 0.5) - 1) % length;
    return this.items[idx];
  }
}
