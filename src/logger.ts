import {createLogger, format, LogEntry, transports} from "winston";
import Transport, {TransportStreamOptions} from "winston-transport";
import {APP_VERSION} from "@/global-params";

class DiscordTransport extends Transport {
  private readonly webhook: string;
  private static colors : {[key: string] : number} = {
    error: 15548997,
    warn: 16776960,
    info: 5763719,
    debug: 3447003,
  }

  constructor(opts : TransportStreamOptions & {webhook: string}) {
    super(opts);
    this.webhook = opts.webhook;
  }

  async log(info: LogEntry, callback: () => void) {
    const {message, level, timestamp, ...meta} = info;
    const lvl = level.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
    const color : number = DiscordTransport.colors[lvl] || 0;
    const appVersion = APP_VERSION;
    const nodeVersion = process.version;
    const os = process.platform;
    const timestampISO = new Date(timestamp).toISOString();

    const body = {
      embeds: [
        {
          title: lvl.toUpperCase(),
          description: message,
          color,
          timestamp: timestampISO,
          fields: (meta.length === 0) ? Object.entries(meta).map(([name, value]) => ({name, value})) : undefined,
          footer: {
            text: `EkaiiWebApp ${appVersion} | Node Version: ${nodeVersion} | OS: ${os}`,
            icon_url: 'https://cdn.discordapp.com/icons/1185979056626356265/2917571624fee05c1dd4514dcdbd89ab.webp'
          }
        }
      ],
      avatar_url: 'https://cdn.discordapp.com/icons/1185979056626356265/2917571624fee05c1dd4514dcdbd89ab.webp',
      username: 'EkaiiWebApp'
    }

    const res = await fetch(this.webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    callback();
  }
}

export const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? 'info' : 'debug',
  format: format.combine(
    format.colorize(),
    format.timestamp(
      {
        format: 'YYYY-MM-DD HH:mm:ss:SSS'
      }
    ),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error', format: format.json()}),
    new DiscordTransport({ level: 'error', webhook : process.env.DISCORD_WEBHOOK!}),
  ],
})