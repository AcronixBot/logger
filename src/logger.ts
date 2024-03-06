import winston, { format, transports } from "winston";
import * as fs from "fs";
import * as path from "path";


export class AcronixLogger extends winston.Logger {
    private static logDir = "logs";

    private static errorLogStream = fs.createWriteStream(AcronixLogger.getSafePath("error.log"), { flags: "a" });

    constructor() {
        super({
            exitOnError: false,
            transports: [
                AcronixLogger.defaultConsole,
                new transports.Stream({
                    stream: AcronixLogger.errorLogStream,
                    level: 'error',
                    handleExceptions: true,
                    handleRejections: true,
                    format: format.combine(
                        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                        format.printf(({ level, message, timestamp }) => {
                            return `[${timestamp}] ${level} :: ${message}`;
                        }),
                    ),
                })
            ],
        });
    }

    private static getSafePath(name: string) {
        return path.join(AcronixLogger.logDir, name);
    }

    private static defaultConsole: transports.ConsoleTransportInstance = new transports.Console({
        handleExceptions: true,
        handleRejections: true,
        format: format.combine(
            format.colorize({ all: true }),
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            format.printf(({ level, message, timestamp }) => {
                return `[${timestamp}] ${level} :: ${message}`;
            }),
        ),
    });

    /**
     * Secures that the log dir exists 
     */
    public static genLogDir() {
        if (!fs.existsSync(AcronixLogger.logDir)) {
            fs.mkdirSync(AcronixLogger.logDir);

            // Pfad für die .gitignore-Datei erstellen
            const gitignorePath = path.join(AcronixLogger.logDir, '.gitignore');

            // Inhalt der .gitignore-Datei
            const gitignoreContent = '*.log';

            // .gitignore-Datei schreiben
            fs.writeFileSync(gitignorePath, gitignoreContent);
        }
    }

    /**
     * Logs an error
     * @param msg 
     */
    public $error(msg: string | object) {
        this.log({
            level: "error",
            //@ts-ignore
            message: msg,
        });
    }

    /**
     * Logs a msg
     * @param msg 
     */
    public $warn(msg: string | object) {
        this.log({
            level: "warn",
            message: typeof msg === "object" ? JSON.stringify(msg) : msg,
        })
    }

    /**
     * Logs a message
     * @param msg 
     */
    public $info(msg: string | object) {
        this.log({
            level: "info",
            message: typeof msg === "object" ? JSON.stringify(msg) : msg,
        });
    }
}