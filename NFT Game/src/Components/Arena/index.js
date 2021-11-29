import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformFarmData } from '../../constants';
import NFTGAME from '../../utils/MyEpicGame.json';
import './Arena.css';
import LoadingIndicator from './../LoadingIndicator';

/*
 * We pass in our characterNFT metadata so we can a cool card in our UI
 */
const Arena = ({ characterNFT, setCharacterNFT  }) => {
  // State
  const [gameContract, setGameContract] = useState(null);

  //  State that will hold our boss metadata

    const [boss, setBoss] = useState(null);
    /*
    * We are going to use this to add a bit of fancy animations during attacks
    */
    const [attackState, setAttackState] = useState('');

    /*
* Toast state management
*/
const [showToast, setShowToast] = useState(false);



    // Action
    const runAttackAction = async() =>{
        try {
            if (gameContract) {
              setAttackState('Attacking');
              console.log('Attacking boss...');
              const attackTxn = await gameContract.attackBoss();
              await attackTxn.wait();
              console.log('attackTxn:', attackTxn);
              setAttackState('hit');
               /*
      * Set your toast state to true and then false 5 seconds later
      */
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
          }
      } catch (error) {
        console.error('Error attacking boss:', error);
        setAttackState('');
      }
  };

  // UseEffects
  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        NFTGAME.abi,
        signer
      );

      setGameContract(gameContract);
    } else {
      console.log('Ethereum object not found');
    }
  }, []);

  // UseEffects
  // UseEffects
  useEffect(() => {
    const fetchBoss = async () => {
        const bossTxn = await gameContract.getBigFarmer();
        console.log('Boss:', bossTxn);
        setBoss(transformFarmData(bossTxn));
    };

    /*
    * Setup logic when this event is fired off
    */
    const onAttackComplete = (newbossmilkNeeded, newPlayermilkProduced) => {
        const bossHp = newbossmilkNeeded.toNumber();
        const playerHp = newPlayermilkProduced.toNumber();

        console.log(`AttackComplete: Farmer milkNeeded: ${bossHp} player milk Produced: ${playerHp}`);

        /*
        * Update both player and boss Hp
        */
        setBoss((prevState) => {
            return { ...prevState, milkNeeded: bossHp };
        });

        setCharacterNFT((prevState) => {
            return { ...prevState, milkProduced: playerHp };
        });
    };

    if (gameContract) {
        fetchBoss();
        gameContract.on('AttackComplete', onAttackComplete);
    }

    /*
    * Make sure to clean up this event when this component is removed
    */
    return () => {
        if (gameContract) {
            gameContract.off('AttackComplete', onAttackComplete);
        }
    }
 }, [gameContract]);

 const LoadingIndicator = () => {
  return (
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};




 return (
    <div className="arena-container">
      {/* Add your toast HTML right here */}
      {boss && characterNFT && (
        <div id="toast" className={showToast ? 'show' : ''}>
          <div id="desc">{`💥 ${boss.name} was Given  ${characterNFT.milk} milk!`}</div>
        </div>
      )}
  
      {/* Boss */}
      {boss && (
        <div className="boss-container">
          <div className={`boss-content  ${attackState}`}>
            <h2>🔥 {boss.name} 🔥</h2>
            <div className="image-content">
              <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
              <div className="health-bar">
                <progress value={boss.milkNeeded} max={boss.maxMilkNeeded} />
                <p>{`${boss.milkNeeded} / ${boss.maxMilkNeeded} Milk Needed`}</p>
              </div>
            </div>
          </div>
          <div className="attack-container">
            <button className="cta-button" onClick={runAttackAction}>
              {` offer milk to  ${boss.name}`}
            </button>
          </div>
          {attackState === 'Attacking' && (
            <div className="loading-indicator">
              <LoadingIndicator />
              <p>Milking </p>
            </div>
          )}
        </div>
      )}
  
      {/* Character NFT */}
      {characterNFT && (
        <div className="players-container">
          <div className="player-container">
            <h2>Your Character</h2>
            <div className="player">
              <div className="image-content">
                <h2>{characterNFT.name}</h2>
                <img
                  src={characterNFT.imageURI}
                  alt={`Character ${characterNFT.name}`}
                />
                <div className="health-bar">
                  <progress value={characterNFT.milkProduced} max={characterNFT.maxMilkProduced} />
                  <p>{`${characterNFT.milkProduced} / ${characterNFT.maxMilkProduced} milk left`}</p>
                </div>
              </div>
              <div className="stats">
                <h4>{` milk : ${characterNFT.milk}`}</h4>
              </div>
            </div>
          </div>
          {/* <div className="active-players">
            <h2>Active Players</h2>
            <div className="players-list">{renderActivePlayersList()}</div>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default Arena;