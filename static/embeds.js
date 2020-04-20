module.exports = {
    sendEmbed : (color,text,subtext,authorName,authorImage) => {
        const embed = {
            title: text,
            description: subtext,
            color: color,
            timestamp: "2020-04-20T00:02:35.825Z",
            author: {
                name: authorName,
                icon_url: authorImage
            }
        }
        return embed;
    }
}