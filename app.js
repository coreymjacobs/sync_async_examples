//measure execution time
const NS_PER_SEC = 1e9;
const MS_PER_NS = 1e-6
const time = process.hrtime();
//////////////////////////////////

console.log("start file");


//trying in different formats
function someFunction(req) {
    return new Promise(function(resolve, reject) {
      resolve(console.log("someFunction " + req));
      //this doesn't work, not sure how to do many things in resolve
      resolve(myVar = "result from someFunction");
      reject(Error("Failed!"));
    });
}

//same as above but different format
function someFunction2(req) {
  return new Promise(resolve => {
    console.log("someFunction2 " + req);
    //let myVar = "result from someFunction2";
    resolve(myVar = "result from someFunction2");
    //return myVar;
  },
  reject => {
    console.error("there was an error, someFunction2");
  }
  );
}

//using this to test series and parallel loops
//added a small delay to see which is faster when run in different state
//obviously parallel will run all for requests at the same time
//series will run one after the other, taking longer
function someFunction3(req) {
  console.log("someFunction3 " + req);
  return new Promise(resolve => {
    setTimeout(resolve, 1000);
  },
  reject => {
    console.error("there was an error, someFunction3");
  }
  );
}

//async function calling those from above
//can also be written as
//const myAsyncFunc = async() => {
async function myAsyncFunc() {
  try {
    console.log("myAsyncFunc called");
    //this is in parallel
    //let result = await someFunction();
    //let result2 = await someFunction2();
    //this is concurrent, notice that some values are still promised if don't await
    //let result = await someFunction();
    //let result2 = someFunction2();
    //console.log(`myAsyncFunc result 1: ${result}`);
    //console.log(`myAsyncFunc result 2: ${result2}`);
    //can also run both concurrently like this, both are added to result
    let result = await Promise.all([someFunction("called from myAsymcFunc"), someFunction2("called from myAsymcFunc")]);
    console.log(`myAsyncFunc result 1 (inside function): ${result[0]}`);
    console.log(`myAsyncFunc result 2 (inside function): ${result[1]}`);
    console.log("myAsyncFunc ended");
    return result;
  }
  catch(err) {
    console.error(`***ERROR*** myAsyncFunc ${err}`);
  }
}

//running loops in sequence
//can also be written as
//async function myAsyncFunc2() {
const myAsyncFunc2 = async() => {
 try {
   console.log("myAsyncFunc2 called");
   //run in sequence
   //let does not make i available outsid eof hte loop
   for (let i = 1; i <= 5; i++) {
     console.log("myAsyncFunc2 SEQUENCE output from for loop, myAsyncFunc2, counter: " + i);
     await someFunction3("myAsyncFunc2 called in SEQUENCE, counter: " + i);
     var x = i;
   }
   let result = x;
   console.log(`myAsyncFunc2 result 1 (inside function): ${result}`);
   //console.log(`myAsyncFunc2 result 2 (inside function): ${result2}`);
   console.log("myAsyncFunc2 ended");
 }
 catch(err) {
    console.error(`***ERROR*** myAsyncFunc2 ${err}`);
 }

};

//running loops in parallel
//can also be written as
//async function myAsyncFunc3() {
const myAsyncFunc3 = async() => {
 try {
   console.log("myAsyncFunc3 called");
   //run in sequence
   //let does not make i available outsid eof hte loop
   for (let i = 1; i <= 5; i++) {
     console.log("myAsyncFunc3 PARALLEL output from for loop, counter: " + i);
     someFunction3("myAsyncFunc3 called in PARALLEL, counter: " + i);
     var x = i;
   }
   let result = x;
   console.log(`myAsyncFunc3 result 1 (inside function): ${result}`);
   //console.log(`myAsyncFunc2 result 2 (inside function): ${result2}`);
   console.log("myAsyncFunc3 ended");
 }
 catch(err) {
    console.error(`***ERROR*** myAsyncFunc3 ${err}`);
 }

};

//myAsyncFunc();
//myAsyncFunc2();
//myAsyncFunc3();

console.log("end file");


//measure execution time
async function measureExecTime() {
  //checking myAsyncFun first
  let returnValue = await myAsyncFunc();
  //let returnValue = myAsyncFunc();
  console.log("myAsyncFunc output (outside function) " + returnValue);
  const diff = process.hrtime(time);
  console.log(`myAsyncFunc Benchmark took ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds`);
  console.log(`Benchmark took ${ (diff[0] * NS_PER_SEC + diff[1])  * MS_PER_NS } milliseconds`);
  //now checking myAsycFunc2
  //await myAsyncFunc2();
  myAsyncFunc2();
  const diff2 = process.hrtime(time);
  console.log(`myAsynFunc2 Benchmark took ${diff2[0] * NS_PER_SEC + diff2[1]} nanoseconds`);
  console.log(`Benchmark took ${ (diff2[0] * NS_PER_SEC + diff2[1])  * MS_PER_NS } milliseconds`);
  //now checking myAsycFunc3
  //await myAsyncFunc3();
  myAsyncFunc3();
  const diff3 = process.hrtime(time);
  console.log(`myAsynFunc3 Benchmark took ${diff3[0] * NS_PER_SEC + diff3[1]} nanoseconds`);
  console.log(`Benchmark took ${ (diff3[0] * NS_PER_SEC + diff3[1])  * MS_PER_NS } milliseconds`);
}
measureExecTime();