import React from "react";
import UserLinkComponent from '../UserLinkComponent'
/* <<<<<<< components/leaderboard/Item.js */
import badge1Icon from '../icons/badge-1.png';
import badge2Icon from '../icons/badge-2.png';
import badge3Icon from '../icons/badge-3.png';
/* =======
>>>>>>> components/leaderboard/Item.js */


export default function Item({ row, index, isHeader }) {

  return (
    <li className="item">
        {isHeader ? <span className="item_header_rank">{row.rank}</span>:<span className="item__rank">{index+1}</span>}
        <span className="item__name">{row.name}</span> 

        {isHeader ? <span className="item__name">{row.name}</span> : <span className="item__name"><UserLinkComponent uuid={row.uuid} name={row.name} showOwnName={true}/> </span> } 
        <span className="item__score">{row.score}</span>
        <span className="item__num_mcq_solved">{row.num_mcq_solved}</span>
        <span className="item__num_challenge_solved">{row.num_challenge_solved}</span>
        {isHeader ? <span className="item__badges">{row.badges}</span> : <span className="item__badges">{
          row.badges ? <img style={{ width: '40px' }} src={badge2Icon.src} /> : <img style={{ width: '40px' }} src={badge1Icon.src} />
        }</span> }
    </li>
  );
}


/*<<<<<<< components/leaderboard/Item.js 
    <li className={'list-item ' + (isHeader ? 'list-header' : '')}>
      {isHeader ? <span className="item__name">{row.name}</span> : <span className="item__name"><UserLinkComponent uuid={row.uuid} name={row.name} showOwnName={true}/> </span> } 
      /*
      <span className="item__score">{row.score}</span>
      <span className="item__mcqsolved">{row.mcqsolved}</span>
      <span className="item__challsolved">{row.challsolved}</span>
      {
        isHeader ? <span className="item__badges">{row.badges}</span> : <span className="item__badges">{
          row.badges ? <img style={{ width: '40px' }} src={badge2Icon.src} /> : <img style={{ width: '40px' }} src={badge1Icon.src} />
        }</span>
      }
======= 
    <li className="item">
        {isHeader ? <span className="item_header_rank">{row.rank}</span>:<span className="item__rank">{index+1}</span>}
        {isHeader ? <span className="item__name">{row.name}</span> : <span className="item__name"><UserLinkComponent uuid={row.uuid} name={row.name} showOwnName={true}/> </span> } 
        // This (above) module is not working properly, causing the first (ranked) user username to not be displayed.
        <span className="item__score">{row.score}</span>
        <span className="item__num_mcq_solved">{row.num_mcq_solved}</span>
        <span className="item__num_challenge_solved">{row.num_challenge_solved}</span>
        <span className="item__badges">Badges Placeholder</span>
/* >>>>>>> components/leaderboard/Item.js */
