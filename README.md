# Merkle-Heap-Priority-Queue
This is an implementation of Merkle-Heap Priority Queue (), that will contribute to Mina Protocol.

A Merkle heap-based priority queue will be a data structure that starts as a heap structure and then takes the form of a binary heap . It will allow efficient insertion, deletion, and comparison of elements in a first-in, first-out manner. This makes it possible to perform operations such as finding the minimum or maximum element in the queue or checking whether the queue contains a particular element in constant time and for some operation such as deleting key and inserting in logarithmic time.

**The potential use cases of Merkle heap-based queueing include:**

- Applications of the **Shortest Path Algorithm (Dijkstra’s shortest path algorithm)**
- Anytime a developer needs to fetch the ‘next best’, ‘next worse’ element.
- Data compression using Huffman coding
- Best first search algorithms. Grab the next promising node in the graph.
- Minimum spanning Tree Algorithms
- Order book data structure for constantly updating a queue after new orders are placed.

There are several benefits of using Merkle heap-based queueing for developers in Mina, such as:

**Improved efficiency:** By using a Merkle heap-based queue to store and process transactions,  performing operations such as finding the minimum or maximum element in the queue in constant time except for enqueue and dequeue ( which will be performed in logarithmic time)

**Increased reliability:** The ability to efficiently compare and hash elements in the queue would improve the accuracy and reliability of the data, as it would be able to more accurately detect and prevent errors or inconsistencies. 

**How Queueing works:** For our implementation queueing will work heap-sizing the data that constructs the Merkle-Tree. So all the data will be queued depending on the queueing logic and then a Merkle Tree will be constructed. 

**Functions and operations** 
The operations that could be executed using this library are

| Operation | Description | Targeted Complexity  
| :---:   | :---: | :---:
| Insert | The insert function will modify the pointers given in the array that constitutes the data of the Merkle Tree | O(log(n))
| deleteKey | With a given key deletes an arbitrary element from the queue.   | O(log(n)
| deleteMin() |Removes the element that was placed in the front of the queue | O(log(n))
| getRoot() | Gets the root hash  of a Merkle-Heap  | O(1)
| getWitness() |Gets the Witness of a Merkle-Heap   | O(1)
| isInQueue() |It checks if a given value or hash is inside a MerkleQueue  | O(1)
| findMin() |Finds the element with the least value in the queue. | O(1)
| findMax() |Finds the element with the highest value in the queue. | O(1)
| insertExtract() |It inserts and element and then extracts another one  | O(log(n))|

**Thanks to Evan Shapiro and Florian from the O(1) labs team for helping us figuring this implementation out** 
