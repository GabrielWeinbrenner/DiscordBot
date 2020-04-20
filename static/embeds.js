module.exports = {
    sendEmbed : (color,text,subtext,authorName,authorImage) => {
        const embed = {
            description: text,
            color: color,
            timestamp: "2020-04-20T00:02:35.825Z",
            author: {
                name: authorName,
                icon_url: authorImage
            },
            fields: [
                {
                    name: "",
                    value: subtext
                }
            ],
        }
        return embed;
    }
}