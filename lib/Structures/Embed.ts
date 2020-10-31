interface Field {
    name:    string;
    value:   string;
    inline?: boolean;
}

interface Footer {
    text:      string;
    icon_url?: string;
}

interface Author {
    name?:     string;
    url?:      string;
    icon_url?: string;
}

export interface EmbedObject {
    title?:       string;
    description?: string;
    url?:         string;
    color?:       string | number;
    fields?:      Field[];
    footer?:      Footer;
    author?:      Author;
}

export default class Embed {
    data: EmbedObject;

    constructor (data?: EmbedObject) {
        if (data) this.data = data;
        else this.data = {};
    }

    /**
     * @description Update the embed's title
     * @param {string} title The new title for the embed
     */
    setTitle(title: string) {
        this.data.title = title;
        return this;
    }

    /**
     * @description Update the embed's description
     * @param {string} description The new description for the embed
     */
    setDescription(description: string) {
        this.data.description = description;
        return this;
    }

    /**
     * @description Update the embed's URL
     * @param {string} url The new URL for the embed
     */
    setURL(url: string) {
        this.data.url = url;
        return this;
    }

    /**
     * @description Update the embed's color
     * @param {number} color The new color for the embed, as an integer color code
     */
    setColor(color: string) {
        this.data.color = color;
        return this;
    }

    /**
     * @description Add a field to the embed
     * @param {string} name The new field's name
     * @param {string} value The new field's content
     * @param {boolean} inline Wether the field is inline or not
     */
    addField(name: string, value: string, inline?: boolean) {
        if (!this.data.fields) this.data.fields = [];
        this.data.fields.push({
            name,
            value,
            inline: inline || false,
        });
        return this;
    }

    /**
     * @description Update the current embed's footer
     * @param {string} text The footer's new text
     * @param {string} iconURL The footer's new icon URL
     */
    setFooter(text: string, iconURL?: string) {
        this.data.footer = {
            text,
            icon_url: iconURL,
        }
        return this;
    }

    /**
     * @description Update the current embed's author
     * @param {string} name The author's new name
     * @param {string} url The author's new URL
     * @param {string} iconURL The author's new icon URL
     */
    setAuthor(name?: string, url?:string, iconURL?: string) {
        this.data.author = {
            name,
            url,
            icon_url: iconURL,
        }
        return this;
    }
}