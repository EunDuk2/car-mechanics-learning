import {defineConfig} from 'vite';
import {resolve} from 'node:path';
import {readFile,rename,writeFile} from 'node:fs/promises';

const questionsFile=resolve(import.meta.dirname,'data/questions.json');
async function readQuestions(){try{return JSON.parse(await readFile(questionsFile,'utf8'));}catch{return [];}}
function questionsApi(){return {name:'questions-api',configureServer(server){server.middlewares.use('/api/questions',async(req,res,next)=>{if(req.method==='GET'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify(await readQuestions()));return;}if(req.method!=='PUT'){next();return;}let body='';for await(const chunk of req)body+=chunk;try{const questions=JSON.parse(body);if(!Array.isArray(questions))throw Error('질문 형식이 올바르지 않습니다.');const temporary=questionsFile+'.tmp';await writeFile(temporary,JSON.stringify(questions,null,2)+'\n');await rename(temporary,questionsFile);res.setHeader('Content-Type','application/json');res.end(JSON.stringify(questions));}catch(error){res.statusCode=400;res.end(error.message);}});}};}
export default defineConfig({plugins:[questionsApi()],build:{rollupOptions:{input:{main:resolve(import.meta.dirname,'index.html'),assembly:resolve(import.meta.dirname,'assembly.html'),mechanics:resolve(import.meta.dirname,'mechanics.html')}}}});
