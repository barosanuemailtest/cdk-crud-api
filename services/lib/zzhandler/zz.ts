import { add } from '../shared/Utils';

export class zzz {

    public printSum(){
        const someSum = add(1,2);
        console.log(`the sum is: ${someSum}`);
    }

}

new zzz().printSum();