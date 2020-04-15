const ytdl = require("ytdl-core");
const {
	Util
} = require('discord.js');

module.exports = {
    name: "play",
    description: "Play song in the channel",
    async execute(msg){
        try{
            const args = msg.content.split(" ");
            const queue = msg.client.queue;      
            const serverQueue = msg.client.queue.get(msg.guild.id);
            // console.log(queue);
            // console.log("-----");
            // console.log(serverQueue);
            console.log(args);
            const voiceChannel = msg.member.voiceChannel;
            if (!voiceChannel) return msg.channel.send('You need to be in a voice channel to play music!');
            const permissions = voiceChannel.permissionsFor(msg.client.user);

            if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
                return msg.channel.send('I need the permissions to join and speak in your voice channel!');
            }

            const songInfo = await ytdl.getInfo(args[2]);
            const song = {
                title: songInfo.title,
                url: songInfo.video_url,
            };
            msg.channel.send("Now Playing " + song.title);

            if (!serverQueue) {
                const queueConstruct = {
                    textChannel: msg.channel,
                    voiceChannel: voiceChannel,
                    connection: null,
                    songs: [],
                    volume: 5,
                    playing: true,
                };
                console.log(queueConstruct.voiceChannel);
                queue.set(msg.guild.id, queueConstruct);
    
                queueConstruct.songs.push(song);
    
                try {
                    var connection = await queueConstruct.voiceChannel.join();
                    queueConstruct.connection = connection;
                    this.play(msg, queueConstruct.songs[0]);
                } catch (err) {
                    console.log(err);
                    queue.delete(msg.guild.id);
                    return msg.channel.send(err);
                }
            } else {
                serverQueue.songs.push(song);
                return msg.channel.send(`${song.title} has been added to the queue!`);
            }


        }catch (error){
            msg.channel.send(error.message);
        }
    },
    play(msg, song) {
		const queue = msg.client.queue;
		const guild = msg.guild;
		const serverQueue = queue.get(msg.guild.id);
	
		if (!song) {
			serverQueue.voiceChannel.leave();
			queue.delete(guild.id);
			return;
		}
	
		const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
			.on('end', () => {
				console.log('Music ended!');
				serverQueue.songs.shift();
				this.play(msg, serverQueue.songs[0]);
			})
			.on('error', error => {
				console.error(error);
			});
		dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
	}

}