import { Field } from "snarkyjs";
import {
    Circuit,
    MerkleTree, 
    isReady
}from 'snarkyjs';

// O solo es un Heap con valores positivos, o gastamos el doble de espacio en hojas.

export class MerkleHeap extends MerkleTree{

    // Change the name of this variable to heapCount?
    private nextIndexToAdd: bigint;

    constructor(height: number) { //Option 1 Merkle Heap extendes from Merkle Tree so we call Merkle Tree constrcutr 
    //Option 2: Instance Merkle Tree library in a variable , can theuy accesses to the private methods? 
        super(height);
        this.nextIndexToAdd = 0n;
    }

    private getFatherIndexOfChild( childIndex: bigint ) {
        return childIndex > 0n ? (childIndex - 1n) / 2n : null;
    }

    private getChildIndexesOfFather( fatherIndex: bigint ) {
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

    private findElementIndex( valueToFind: Field ): bigint | null {
        let currentElement;

        for( let i = 0n; i < this.nextIndexToAdd; i++ ) {            
            currentElement = this.getMerkleTreeLeaf( i );

            if( currentElement?.equals( valueToFind ).toBoolean() )
                return i;
        }

        return null;
    }

    private downHeap( startingIndex: bigint ) {
        let currentIndex = startingIndex;
        let currentValue = this.getMerkleTreeLeaf( currentIndex );

        if( !currentValue ) return;

        let smallerChildIndex = this.getSmallerChildIndexOfFather( currentIndex );
        let smallerChildValue = this.getMerkleTreeLeaf( smallerChildIndex );

        while( smallerChildIndex !== null && smallerChildValue !== null && currentValue.toBigInt() > smallerChildValue.toBigInt() ) {
            this.setLeaf(currentIndex, smallerChildValue);
            this.setLeaf(smallerChildIndex, currentValue);

            currentIndex = smallerChildIndex;
            smallerChildIndex = this.getSmallerChildIndexOfFather( currentIndex );
            smallerChildValue = this.getMerkleTreeLeaf( smallerChildIndex );
        }
    }

    private upHeap( startingIndex: bigint ) {
        let currentIndex = startingIndex;
        let currentValue = this.getMerkleTreeLeaf(currentIndex);

        if( !currentValue ) return;

        let fatherIndex = this.getFatherIndexOfChild(currentIndex);
        let fatherValue = this.getMerkleTreeLeaf(fatherIndex);

        // TODO: Review if is necessary to use Field.gt instead of Field.toBigInt() > Field.toBigInt()
        while( fatherIndex !== null && fatherValue !== null && fatherValue.toBigInt() > currentValue.toBigInt() ) {
            this.setLeaf( fatherIndex, currentValue );
            this.setLeaf( currentIndex, fatherValue );

            currentIndex = fatherIndex;
            fatherIndex = this.getFatherIndexOfChild(currentIndex);
            fatherValue = this.getMerkleTreeLeaf(fatherIndex);
        }
    }

    getMerkleTreeLeaf( index: bigint | null ) {
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
        let currentIndexToAdd = this.nextIndexToAdd;
        this.setLeaf(currentIndexToAdd, value);
        this.nextIndexToAdd = this.nextIndexToAdd + 1n;
        this.upHeap( currentIndexToAdd );
    }

    /**
     * Delete an arbitrary element of the queue at a given index.
     * @param index where the element to delete is going to be located
     * @returns the value that was deleted from the queue.
     */
    deleteElementAtIndex( index: bigint ): Field | null {
        if( index < 0 && index >= this.nextIndexToAdd ) return null;
        const elementToDelete = this.getMerkleTreeLeaf(index);
        
        let lastElementIndex = this.nextIndexToAdd - 1n;
        let currentValue = this.getMerkleTreeLeaf( lastElementIndex );

        if( !currentValue ) return null;

        this.setLeaf(index, currentValue);
        this.setLeaf(lastElementIndex, new Field(0));
        this.nextIndexToAdd = this.nextIndexToAdd - 1n;

        this.downHeap( index );

        return elementToDelete;
    }

    /**
     * Delete an arbitrary element of the queue with a given value.
     * @param value that is going to be searched and deleted if it is found.
     * @returns the value deleted from the queue.
     */
    deleteElement( value: Field ): Field | null {
        let elementToDeleteIndex = this.findElementIndex( value );

        return elementToDeleteIndex !== null 
            ? this.deleteElementAtIndex( elementToDeleteIndex ) 
            : null;
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
        return this.deleteElementAtIndex(0n);
    }

    /**
     * Delete the min element of the heap and then insert another element.
     * It is more efficient than executing a deleteMin and an insert independently.
     * @param insertValue 
     * @returns the value that was inserted after the deleteMin
     */
    deleteMinThenInsert( insertValue: Field ): Field {
        this.setLeaf(0n, insertValue);
        this.nextIndexToAdd = this.nextIndexToAdd - 1n;

        this.downHeap( 0n );

        return insertValue;
    }

    /**
     * Insert an element into the heap and then extract the root of the tree.
     * It is more efficient than executing an insert and a deleteMin independently.
     * @param insertValue 
     * @returns the min value deleted from the queue.
     */
    insertThenDeleteMin( insertValue: Field ): Field {
        const root = this.getHeapRoot();

        if( root == null || root?.toBigInt() > insertValue.toBigInt() )
            return insertValue;

        this.setLeaf(0n, insertValue);
        this.nextIndexToAdd = this.nextIndexToAdd - 1n;

        this.downHeap( 0n );

        return root;
    }

    /**
     * Search if a value is part of the queue
     * @param value to search.
     * @returns true if the value is in the queue or false otherwise.
     */
    inQueue( value: Field ): boolean {
        return this.findElement( value ) == null ? false : true;
    }

    /**
     * @returns the min element of the queue without deleting it.
     */
    findMin(): Field | null {
        return this.getHeapRoot();
    }

    /**
     * Find an arbitrary element in the heap without deleting it.
     * @param valueToFind
     * @returns the element found or null if it doesn't exist.
     */
    findElement( valueToFind: Field ): Field | null {
        let elementFoundIndex = this.findElementIndex( valueToFind );

        return this.getMerkleTreeLeaf( elementFoundIndex );
    }

    /**
     * // TODO: We are going to implement this?
     * @returns the max element of the queue without deleting it.
     */
    findMax(): Field {
        return new Field(0);
    }

}