import mongoose, { Document, Schema } from 'mongoose';

interface Player extends Document {
  name: string;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

const PlayerSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  points: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

const Player = mongoose.model<Player>('Player', PlayerSchema)

export class PlayerModel {
  async create(player: string): Promise<any> {
    if (!player) {
      return this.parseMessage('empty');
    }

    // Parse player to lowercase
    const parsedPlayer = player.toLowerCase();

    // Find existing player
    const currentPlayer = await Player.findOne({ name: parsedPlayer })
    if (currentPlayer) {
      return this.parseMessage('foundPlayer');
    }

    // Create new player
    const newPlayer = await Player.create(
      { name: parsedPlayer, points: 0, createdAt: Date.now(), updatedAt: Date.now() }
    )
    if (!newPlayer) {
      return this.parseMessage('serverError');
    }
    return this.parseMessage('success');
  }

  async update(player: string, points: string): Promise<any> {
    if (!player || !points) {
      return this.parseMessage('empty');
    }

    // Parse player to lowercase
    const parsedPlayer = player.toLowerCase();

    const updatePoints = parseInt(points);
    const updatedPlayer = await Player.findOneAndUpdate(
      { name: parsedPlayer },
      { $inc: { points: +updatePoints }, updatedAt: Date.now() },
    )

    if (!updatedPlayer) {
      return '無呢個人喎，你打`!addPlayer [名]`加佢入Database先啦'
    }

    const playerList = await Player.find({}, '-_id name points').exec()
    return this.parseMessage('update', playerList);
  }

  parseMessage(messageType: string, playerList?: Player[]): Promise<any> {
    let content = null;
    switch (messageType) {
      case 'empty':
        content = '試下打啲野...';
        break;
      case 'foundPlayer':
        content = '呢條友係Database啦！';
        break;
      case 'serverError':
        content = 'Database出事喎！搵Fabby\\/GagGod睇下乜事！';
        break;
      case 'success':
        content = '搞掂！'
        break;
      case 'update': {
        const parsedPlayerList = playerList
          .sort((a, b) => b.points - a.points)
          .map((player, index) => `第${index+1}位: ${player.name} ${player.points}分`)
        content = `呢條就係最新既分數List:\n${parsedPlayerList.join('\n')}`
      }
        break;
      default:
        content = 'Gag'
    }

    return content;
  }
}