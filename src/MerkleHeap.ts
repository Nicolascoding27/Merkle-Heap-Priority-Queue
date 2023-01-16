import { Field } from "snarkyjs";

export class MerkleHeap {

    constructor() { //Option 1 Merkle Heap extendes from Merkle Tree so we call Merkle Tree constrcutr 
    //Option 2: Instance Merkle Tree library in a variable , can theuy accesses to the private methods? 
        
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
    }

    /**
     * Delete an arbitrary element of the queue with a given value.
     * @param value that is going to be searched and deleted if it is found.
     * @returns the value deleted from the queue.
     */
    deleteElement( value: Field ): Field {
        return value;
    }

    /**
     * Delete the minimum element in the queue.
     * @returns the min value deleted from the queue.
     */
    deleteMin(): Field {
        return new Field(0);
    }

    /**
     * Insert an element into the heap and then extract the root of the tree.
     * It is more efficiente than executing an insert and a deleteMin independently.
     * @param insertValue 
     */
    insertThenDeleteMin( insertValue: Field ): Field {
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
    findMin(): Field {
        return new Field(0);
    }

    /**
     * @returns the max element of the queue without deleting it.
     */
    findMax(): Field {
        return new Field(0);
    }

}