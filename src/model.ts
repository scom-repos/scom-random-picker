import { Module } from '@ijstech/components';
import formSchema from './formSchema';
import configData from './data.json';
const SIZE = 480;
export const colors = ['#afa939', '#2b580c', '#ff0000', '#800080', '#FFA500'];

export interface IItem {
  name: string;
  icon?: string;
  weight?: number;
}

export interface IWheelPickerData {
  title?: string;
  items: IItem[];
  size?: number;
}

export class Model {
  private module: Module;
  private _data: IWheelPickerData = { items: [], size: SIZE };
  private _items: IItem[] = [];
  private _currentItem: IItem;
  private currentDeg: number = 0;
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
    return this._items;
  }

  get totalWeight() {
    const totalWeight = this.items.reduce((total, item) => total + item.weight, 0);
    return totalWeight;
  }

  get currentItem() {
    return this._currentItem;
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
    const array = value?.items || [];
    this._items = [...array].map(v => {
      return {
        ...v,
        weight: v.weight || 1
      }
    });
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

  handleSpin() {
    const randomNum = Math.random() * this.totalWeight;
    let cumulativeWeight = 0;
    let chosenItem: IItem;
    for (const item of this.items) {
      cumulativeWeight += item.weight;
      if (randomNum <= cumulativeWeight) {
        chosenItem = item;
        break;
      }
    }
    this._currentItem = chosenItem;
    const weight = chosenItem.weight;
    let rounded = 0;
    if (this.currentDeg) {
      rounded = 360 - (this.currentDeg % 360);
    }
    const degPerPart = 360 / this.totalWeight;
    const idx = this.items.indexOf(chosenItem);
    let adjustedDeg = 0;
    if (idx !== 0) {
      const halfDegPerPart = degPerPart / 2;
      const addedDeg = halfDegPerPart * (weight - 1);
      const removedDeg = halfDegPerPart * (this.items[0].weight - 1);
      adjustedDeg = addedDeg - removedDeg;
    }
    const startWeight = (idx > 0) ? this.items.slice(0, idx).reduce((acc, val) => acc + val.weight, 0) : 0;
    const baseDeg = 90 + 360 * 5 + adjustedDeg + (degPerPart * startWeight);
    const randomDeg = (Math.random() - 0.5) * (degPerPart * weight);
    // Prevent the arrow from pointing directly at the intersection point between the items
    const finalRandomDeg = randomDeg > 0 ? randomDeg - 1 : randomDeg + 1;
    const resultDeg = baseDeg + finalRandomDeg;
    this.currentDeg += resultDeg;
    const finalDeg = rounded + this.currentDeg;
    return {
      item: chosenItem,
      deg: finalDeg
    }
  }
}
