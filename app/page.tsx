'use client';

import Image from 'next/image';
import Chat from './components/Chat';

export default function Home() {
  return (
    <main className="App">
      <div className='container'>
        <div className='logoBox'>
          <Image src="/RichieLogo.png" alt="SuperViral.ai logo" width="380" height="90" />
          <p>Ask Richie anything you want!</p>
        </div>
        <Chat />
      </div>
    </main>
  )
}