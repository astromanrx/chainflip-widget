import { AssetData } from '@chainflip/sdk/swap'
import { create } from 'zustand'

interface State{
    sourceAmount:number,
    sourceToken: AssetData | undefined
    destAmount:number
    destToken: AssetData | undefined
    setSourceAmount: (amount:number)=>void
    setSourceToken: (token: AssetData)=>void
    setDestAmount: (amount: number)=>void
    setDestToken: (token: AssetData)=>void
    clearSourceAmount:()=>void
    swapSourceWithDest:()=>void
}

const useWidgetStore = create<State>((set) => ({
  sourceAmount: 0,  
  destAmount: 0,
  sourceToken: undefined,
  destToken: undefined,
  setSourceAmount: (amount: number  ) => set({ sourceAmount: amount }),
  setSourceToken: (token: AssetData) => set({ sourceToken: token }),
  setDestAmount: (amount: number  ) => set({ destAmount: amount }), 
  setDestToken: (token: AssetData) => set({ destToken: token }), 
  swapSourceWithDest: ()=>set((state)=>({ destAmount: state.sourceAmount,sourceAmount:state.destAmount  })),
  clearSourceAmount: ()=>set({sourceAmount: 0})  
}))

export {useWidgetStore}