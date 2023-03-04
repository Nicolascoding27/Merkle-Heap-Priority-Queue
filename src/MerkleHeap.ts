import { Field } from "snarkyjs";
import {
    Circuit,
    MerkleTree, 
    isReady
}from 'snarkyjs';

// O solo es un Heap con valores positivos, o gastamos el doble de espacio en hojas.
await isReady
export class MerkleHeap extends MerkleTree{
    // Change the name of this variable to heapCount?
    private nextIndexToAdd: bigint;
    constructor (height: number) { //Option 1 Merkle Heap extendes from Merkle Tree so we call Merkle Tree constrcutr 
    //Option 2: Instance Merkle Tree library in a variable , can theuy accesses to the private methods? 
        super(height);
        this.nextIndexToAdd = 0n;
    }
    // async init (callback:any) {
    //     await isReady;
    //     // do something async and call the callback:
    //     callback.bind(this)();
    // }
    private getFatherIndexOfChild( childIndex: bigint ) {
        return childIndex > 0n ? (childIndex - 1n) / 2n : null;
    }

     getChildIndexesOfFather( fatherIndex: bigint ) {
        let leftIndex = (2n * fatherIndex) + 1n;

        if( leftIndex >= this.nextIndexToAdd ) return {left: null, right: null};

        return {
            left: leftIndex,
            right: leftIndex + 1n
        }
    }

    private getSmallerChildIndexOfFather( fatherIndex: bigint ) {
        let childIndexes = this.getChildIndexesOfFather( fatherIndex );

        let leftChildValue = this.getMerkleTreeLeaf( childIndexes.left );
        let rightChildValue = this.getMerkleTreeLeaf( childIndexes.right );

        if( !leftChildValue ) return null;

        return !rightChildValue || leftChildValue.lte(rightChildValue) ? childIndexes.left : childIndexes.right;
    }

    private getHeapRoot() {
        return this.getMerkleTreeLeaf(0n);
    }

    //TODO: REVIEW NAME
   public  getMerkleTreeLeaf( index: bigint | null ) {
        return index !== null && index >= 0 && index < this.nextIndexToAdd
            ? this.getNode(0, index) 
            : null;
    }

    /**
     * Insert an element into the heap, mantaining the Heap 
     * Property and recalculating the hashes of the Merkle Tree.
     * @param value that is going to be inserted
     */
    insert( value: Field ) {
        // Insert the element at the leftmost open space in the bottom of the heap.
        // Compare the element with its father. If they are in the correct order, stop
        // Otherwise swap the element with its father and make the comparison again.
        // Until the Heap Property is correct.
        this.setLeaf(this.nextIndexToAdd, value);
        let currentChildIndex = this.nextIndexToAdd;
        let fatherIndex = this.getFatherIndexOfChild(currentChildIndex);
        let fatherValue = this.getMerkleTreeLeaf(fatherIndex);

        // TODO: Review if is necessary to use Field.gt instead of Field.toBigInt() > Field.toBigInt()
        while( fatherIndex !== null && fatherValue !== null && fatherValue.toBigInt() > value.toBigInt() ) {
            this.setLeaf( fatherIndex, value );
            this.setLeaf( currentChildIndex, fatherValue );

            currentChildIndex = fatherIndex;
            fatherIndex = this.getFatherIndexOfChild(currentChildIndex);
            fatherValue = this.getMerkleTreeLeaf(fatherIndex);
        }

        this.nextIndexToAdd = this.nextIndexToAdd + 1n;
    }

    /**
     * Delete an arbitrary element of the queue with a given value.
     * @param value that is going to be searched and deleted if it is found.
     * @returns the value deleted from the queue.
   `  */
    deleteElement( value: Field ): Field {
        return value;
    }

    /**
     * Delete the minimum element in the queue.
     * @returns the min value deleted from the queue.
     */
    deleteMin(): Field | null {
        // Replace the root of the tree with the last element of the last level.
        // Reduce this.nextIndexToAdd
        // Set the deleted leaf to a zero value in the MerkleTree (This is absoulutely necessary??)
        // Compare the element with its children. If it is in correct order, stop.
        // If not, swap the element.
        // Repeat this until the heap property is correct.
        const root = this.getHeapRoot();

        let lastElementIndex = this.nextIndexToAdd - 1n;
        let currentValue = this.getMerkleTreeLeaf(lastElementIndex);

        if( !currentValue ) return null;

        this.setLeaf(0n, currentValue);
        this.nextIndexToAdd = lastElementIndex;
        this.setLeaf(lastElementIndex, new Field(0));

        let currentIndex = 0n;
        let smallerChildIndex = this.getSmallerChildIndexOfFather( currentIndex );
        let smallerChildValue = this.getMerkleTreeLeaf( smallerChildIndex );

        while( smallerChildIndex !== null && smallerChildValue !== null && currentValue.toBigInt() > smallerChildValue.toBigInt() ) {
            this.setLeaf(currentIndex, smallerChildValue);
            this.setLeaf(smallerChildIndex, currentValue);

            currentIndex = smallerChildIndex;
            smallerChildIndex = this.getSmallerChildIndexOfFather( currentIndex );
            smallerChildValue = this.getMerkleTreeLeaf( smallerChildIndex );
        }

        return root;
    }

    /**
     * Insert an element into the heap and then extract the root of the tree.
     * It is more efficiente than executing an insert and a deleteMin independently.
     * @param insertValue 
     */
    insertThenDeleteMin( insertValue: Field ): Field {
        // await isReady()
        return new Field(0);
    }

    /**
     * Search if a value is part of the queue
     * @param value to search.
     * @returns true if the value is in the queue or false otherwise.
     */
    inQueue( value: Field ): Boolean {
        return true;
    }

    /**
     * @returns the min element of the queue without deleting it.
     */
    findMin(): Field | null {
        return this.getHeapRoot();
    }

    /**
     * @returns the max element of the queue without deleting it.
     */
    findMax(): Field {
        return new Field(0);
    }

}