require('dotenv').config();
/** Connect to Moralis server */
const serverUrl = process.env.serverUrl ;
const appId = process.env.appId ;
Moralis.start({ serverUrl, appId });
let user = Moralis.User.current();


function initApp(){
    // document.querySelector("#app").style.display = "block";
    document.querySelector("#submit_button").onclick = submit;
}


defineNewquery = async (batchNumber) =>{
    const RecordHistory =  Moralis.Object.extend('Record');
    const query = new Moralis.Query(RecordHistory);
    const results = await query.equalTo(batchNumber);
    
    
//     const RecordHistory =  Moralis.Object.extend('Record');
//     const record = new RecordHistory();
//     record.set('batchNumber', batchNumber);
//     record.set('DT', DT);
//     record.set('ProductTesting', ProductTesting);
//     record.set('Location', Location);
//     record.set('QualityFactors', QualityFactors);
// ;

//     const metadata = {
//         batchNumber: batchNumber,
//         DT: DT,
//         ProductTesting: ProductTesting,
//         Location: Location,
//         QualityFactors: QualityFactors,
      
//     }

//     record.set('metadata', metadata);

//     console.log(metadata);
//     const jsonFile = new Moralis.File("metadata.json", {base64 : btoa(JSON.stringify(metadata))});
//     await jsonFile.saveIPFS();
    
//     let metadataHash = jsonFile.hash();
//     let ipfsLink = jsonFile.ipfs();
//     console.log(jsonFile.ipfs())
//     console.log(metadataHash)

//     record.set('metadataHash', metadataHash);
//     record.set('jsonFileIPFS', ipfsLink);

//     await record.save();
console.log(results)    
return results;  
}






async function submit(){
    console.log('clicked')

    await defineNewquery(
    document.querySelector('#input_search').value,
    )

    
    document.querySelector('#success_message').innerHTML = results;
    document.querySelector('#success_message').style.display = "block";
    // setTimeout(() => {
    //     document.querySelector('#success_message').style.display = "none";
    // }, 5000)
}

initApp()