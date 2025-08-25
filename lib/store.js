const path = require("path");
const { writeFileSafe } = require("./fs-utils");

function storeDepsReact(store) {
  const deps = [];
  switch (store) {
    case "redux": deps.push("@reduxjs/toolkit", "react-redux"); break;
    case "mobx": deps.push("mobx", "mobx-react-lite"); break;
    case "react-query": deps.push("@tanstack/react-query"); break;
  }
  return deps;
}

function writeReduxFiles(projectDir, useTS) {
  const ext = useTS ? "ts" : "js";
  writeFileSafe(path.join(projectDir, "src", "store", `counterSlice.${ext}`), `import { createSlice${useTS?", PayloadAction":""} } from '@reduxjs/toolkit';
const initialState${useTS?": { value: number }":""} = { value: 0 };
const slice = createSlice({ name: 'counter', initialState, reducers: { inc: (s) => { s.value += 1; }, add: (s, a${useTS?": PayloadAction<number>":""}) => { s.value += a.payload; } } });
export const { inc, add } = slice.actions;
export default slice.reducer;
`);
  writeFileSafe(path.join(projectDir, "src", "store", `store.${ext}`), `import { configureStore } from '@reduxjs/toolkit';
import counter from './counterSlice';
export const store = configureStore({ reducer: { counter } });
${useTS?"export type RootState = ReturnType<typeof store.getState>;\nexport type AppDispatch = typeof store.dispatch;\n":""}`);
}

function writeMobxFiles(projectDir, useTS) {
  const ext = useTS ? "ts" : "js";
  writeFileSafe(path.join(projectDir, "src", "store", `counterStore.${ext}`), `import { makeAutoObservable } from 'mobx';
export class CounterStore { value${useTS?": number":""} = 0; constructor(){ makeAutoObservable(this); } inc(){ this.value++; } }
export const counterStore = new CounterStore();
`);
}

module.exports = { storeDepsReact, writeReduxFiles, writeMobxFiles };
