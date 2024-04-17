import classes from './detail.module.scss'
import Head, { DigitalLifeHeadInfo } from './head'
import List, { LifeDetail } from '../list/list'

export default function () {
  const currentInfo: DigitalLifeHeadInfo | undefined = undefined
  //  {
  //   name: 'Name',
  // }

  const lifes: LifeDetail[] = [
    {
      id: 0,
      name: 'Cyberwife1',
      desc: 'Your crazey wife is here ...Your crazey wife is here ...Your crazey wife is h ...',
      tags: ['Cyberwife', 'Cyber', 'wife'],
    },
    {
      id: 1,
      name: 'Cyberwife2',
      desc: 'Your crazey wife is here ...Your crazey wife is here ...Your crazey wife is h ...',
      tags: ['Cyberwife', 'Cyber', 'wife'],
    },
    {
      id: 2,
      name: 'Cyberwife3',
      desc: 'Your crazey wife is here ...Your crazey wife is here ...Your crazey wife is h ...',
      tags: ['Cyberwife', 'Cyber', 'wife'],
    },
    {
      id: 3,
      name: 'Cyberwife3',
      desc: 'Your crazey wife is here ...Your crazey wife is here ...Your crazey wife is h ...',
      tags: ['Cyberwife', 'Cyber', 'wife'],
    },
    {
      id: 4,
      name: 'Cyberwife5',
      desc: 'Your crazey wife is here ...Your crazey wife is here ...Your crazey wife is h ...',
      tags: ['Cyberwife', 'Cyber', 'wife'],
    },
    {
      id: 5,
      name: '55555',
      avatarUrl: '/imgs/default-avatar.png',
      desc: 'Your crazey wife is here ...Your crazey wife is here ...Your crazey wife is h ...',
      tags: ['Cyberwife', 'Cyber', 'wife'],
    },
    {
      id: 6,
      name: '66666',
      desc: 'Your crazey wife is here ...Your crazey wife is here ...Your crazey wife is h ...',
      tags: ['Cyberwife', 'Cyber', 'wife'],
    },
    {
      id: 7,
      name: '7777',
      avatarUrl: '/imgs/default-avatar2.png',
      desc: 'Your crazey wife is here ...Your crazey wife is here ...Your crazey wife is h ...',
      tags: ['Cyberwife', 'Cyber', 'wife'],
    },
    {
      id: 8,
      name: '8888',
      desc: 'Your crazey wife is here ...Your crazey wife is here ...Your crazey wife is h ...',
      tags: ['Cyberwife', 'Cyber', 'wife'],
    },
  ]

  return (
    <div className={`${classes.d} flex flex-col h-full w-full`}>
      <div className="flex-none">
        <Head info={currentInfo}></Head>
      </div>
      <div className="flex-1 overflow-hidden">
        <List lifeDetailList={lifes}></List>
      </div>
    </div>
  )
}
