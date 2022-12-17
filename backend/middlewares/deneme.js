


function deneme (params) {
    console.log({params});
}

function printArray(arr,currentIndex=0) {
    if (currentIndex === arr.length) {
        return;
    }
    console.log(arr[currentIndex]);
    printArray(arr,currentIndex + 1);
}

printArray([10,4,7,33,21],)

let k=[8,9,10,12];
