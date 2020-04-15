const ytdl = require("ytdl-core");

module.exports = {
    name: "play",
    description: "Play song in the channel",
    async execute(msg){
        // try{
            const args = msg.content.split(" ");
            const queue = msg.client.queue;      
            const serverQueue = msg.client.queue.get(msg.guild.id);
            // console.log(queue);
            // console.log("-----");
            // console.log(serverQueue);
            console.log(args);
            const voiceChannel = msg.member.voiceChannel;
            const songInfo = await ytdl.getInfo(args[2]);
            const song = {
                title: songInfo.title,
                url: songInfo.video_url,
            };
            msg.channel.send("Now Playing " + song.title);

    



        // }catch (error){
        //     msg.channel.send(error.message);
        // }
    }
}