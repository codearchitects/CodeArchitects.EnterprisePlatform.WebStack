import { dictionary } from './../utilities/common.utility';
/**
 * Palette color
 */
export class ShColor {
    constructor(public name: string, public hex: string) { }
}

/**
 * Color Palette interface
 */
export interface IShColorPalette {
    /**
     * Scale name
     */
    scale: string;
    /**
     * List of scale colors
     */
    colors: ShColor[];
}

/**
 * Color Palette (as dictionary) interface
 */
export interface IShColorPaletteDictionary {
    [scale: string]: { [color: string]: string };
}

/**
 * Color Palette
 */
export class ShColorPalette {

    /**
     * Palettes
     */
    public static palettes: IShColorPalette[] = [
        {
            scale: 'whites',
            colors: [
                { name: 'White', hex: '#FFFFFF' },
                { name: 'Traffic White', hex: '#F8F8F8' },
                { name: 'Mist', hex: '#F6F6F6' },
                { name: 'Smoke White', hex: '#F4F4F4' },
                { name: 'Diamond White', hex: '#EFEFEF' },
                { name: 'Ghost White', hex: '#EDEDED' },
                { name: 'Midnight White', hex: '#E8E8E8' },
                { name: 'Granite', hex: '#DDDDDC' },
                { name: 'Light Aluminium', hex: '#DADADA' },
                { name: 'Silver', hex: '#C8C8C8' },
                { name: 'Grape Cream', hex: '#BDBBBD' }
            ]
        },
        {
            scale: 'grays',
            colors: [
                { name: 'Gray', hex: '#D2D1D1' },
                { name: 'Cool gray', hex: '#CACACA' },
                { name: 'Wind gray', hex: '#C6C6C5' },
                { name: 'Sand gray', hex: '#BFBFBE' },
                { name: 'Wood gray', hex: '#BABABA' },
                { name: 'Dark silver', hex: '#AFAFAE' },
                { name: 'Quick silver', hex: '#A6A6A6' },
                { name: 'Metallic gray', hex: '#A3A3A3' },
                { name: 'Light gray', hex: '#8C8B8B' },
                { name: 'Matrix gray', hex: '#7A7A7A' },
                { name: 'Iron gray', hex: '#757474' },
                { name: 'Artic Seal', hex: '#6D6D6F' },
                { name: 'Lead gray', hex: '#666666' },
                { name: 'Smoke gray', hex: '#5D5C5C' },
                { name: 'Submarine gray', hex: '#515150' },
                { name: 'Antracite', hex: '#575756' },
                { name: 'Blast gray', hex: '#3C3C3B' },
                { name: 'Graphite', hex: '#2E2D2C' },
                { name: 'Dark gray', hex: '#292928' },
                { name: 'Overlay', hex: 'rgba(65, 81, 103, .6)' }
            ]
        },
        {
            scale: 'blacks',
            colors: [
                { name: 'Sea Black', hex: '#464545' },
                { name: 'Spade Black', hex: '#414040' },
                { name: 'Pitch Black', hex: '#4A4A49' },
                { name: 'Lush Black', hex: '#3A3939' },
                { name: 'Midnight Gray', hex: '#2E2E2D' },
                { name: 'Medium Black', hex: '#222221' },
                { name: 'Chinese Black', hex: '#161615' },
                { name: 'Black Mat', hex: '#040405' },
                { name: 'Black', hex: '#000100' }
            ]
        },
        {
            scale: 'blues',
            colors: [
                { name: 'Mistic Violet', hex: '#8686A1' },
                { name: 'Clean Glass', hex: '#D4EDFC' },
                { name: 'Pale Blue', hex: '#83D0F5' },
                { name: 'Pale Cyan', hex: '#8CD2F7' },
                { name: 'Sky', hex: '#6AC7F4' },
                { name: 'Spiro Blue', hex: '#40BBF0' },
                { name: 'Spring Sky', hex: '#36A9E1' },
                { name: 'Azure', hex: '#129BDB' },
                { name: 'Cyan', hex: '#009DDD' },
                { name: 'Stripe Blue', hex: '#0089D4' },
                { name: 'Beautiful Blue', hex: '#0070BF' },
                { name: 'Egyptian Blue', hex: '#005FAC' },
                { name: 'Electric Blue', hex: '#005FAB' },
                { name: 'Dark Blue', hex: '#004F9F' },
                { name: 'Canyon Blue', hex: '#003B8A' },
                { name: 'Purple Grap', hex: '#312783' },
                { name: 'Blue', hex: '#2979ff' },
                { name: 'Aquarell', hex: '#2929CC' },
                { name: 'Ink Blue', hex: '#112347' },
                { name: 'Canyon Blue', hex: '#111E72' }
            ]
        },
        {
            scale: 'reds',
            colors: [
                { name: 'Pink', hex: '#F7D3E7' },
                { name: 'Red Passion', hex: '#E6332A' },
                { name: 'Red Orange', hex: '#E4421A' },
                { name: 'Magenta', hex: '#DB0566' },
                { name: 'Brite Red', hex: '#DB0316' },
                { name: 'Porcelain Red', hex: '#DC051C' },
                { name: 'Red', hex: '#DD1A1E' },
                { name: 'Tall Poppy', hex: '#C1282E' },
                { name: 'Flash Red', hex: '#B21321' }
            ]
        },
        {
            scale: 'yellows',
            colors: [
                { name: 'Pearl Yellow', hex: '#FFFAD2' },
                { name: 'Creme Yellow', hex: '#FFF265' },
                { name: 'Yellow', hex: '#FFED00' },
                { name: 'Pastel Yellow', hex: '#F2E61A' },
                { name: 'Mustard', hex: '#ECD37D' },
                { name: 'Solar Yellow', hex: '#DEDC00' },
                { name: 'Selective Yellow', hex: '#FBBA00' },
                { name: 'Light Orange', hex: '#FB9D28' },
                { name: 'Mandarin', hex: '#FFA900' }
            ]
        },
        {
            scale: 'greens',
            colors: [
                { name: 'Chlorophyll', hex: '#C7CE31' },
                { name: 'Natural Green', hex: '#89B32F' },
                { name: 'Bud Green', hex: '#75B94E' },
                { name: 'Chateau Green', hex: '#47AE4C' },
                { name: 'Acres Green', hex: '#4BA038' },
                { name: 'Green', hex: '#3FA535' },
                { name: 'Medical Green', hex: '#20A392' },
                { name: 'Classic Green', hex: '#195629' },
                { name: 'Grass Green', hex: '#006638' }
            ]
        }
    ];

    /**
     * Transform palettes to dictionary of type: {scale: { color: hex }}
     */
    public static toDictionary(): IShColorPaletteDictionary {
        const retval: dictionary<dictionary<string>> = {};
        this.palettes.forEach(palette => {
            retval[palette.scale] = {};
            palette.colors.forEach(color => {
                let name = '';
                color.name.split(' ').forEach(s => name += s);
                retval[palette.scale][name] = color.hex;
            });
        });
        return retval;
    }
}

/**
 * Icon Palette
 */
export class ShIconPalette {

    /**
     * Palette
     */
    public static palette = [
        'code-creator',
        'scarf-ace',
        'architecture',
        'decorator',
        'react',
        'picker',
        'code',
        'colorpalette',
        'logout',
        'user-empty',
        'user-full',
        'select-on',
        'select-off',
        'multiselect-on',
        'multiselect-off',
        'password-circle',
        'hamburger',
        'search',
        'code-copied',
        'no-icon',
        'down',
        'up',
        'next',
        'back',
        'navigation',
        'menu',
        'context-menu',
        'toast',
        'modal',
        'grid',
        'uploader',
        'card',
        'spinner',
        'utility',
        'date-input',
        'checkbox',
        'radio',
        'toggle',
        'combo',
        'multiselect-input',
        'select-input',
        'textarea',
        'input',
        'button',
        'buttons-indicators',
        'form-controls',
        'master-page',
        'dashboard',
        'layout',
        'home'
    ];
}
