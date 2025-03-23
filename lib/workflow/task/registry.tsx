import { GoogleGenerativeAI } from "./GoogleGenerativeAI";
import { InputTask } from "./InputTask";
import { LaunchBrowserTask } from "./LaunchBrowser";
import { OpenAI } from "./OpenAI";

export const TaskRegistry = {
    LAUNCH_BROWSER: LaunchBrowserTask,
    INPUT: InputTask,
    GOOGLE_GENERATIVE_AI: GoogleGenerativeAI,
    OpenAI: OpenAI
}