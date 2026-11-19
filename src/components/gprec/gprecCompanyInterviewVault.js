// ============================================================================
// GPREC AUTHENTIC CAMPUS RECRUITMENT DRIVE INTERVIEW QUESTION VAULT
// ============================================================================
// Real-world technical viva questions asked in actual campus placement drives
// at G. Pulla Reddy Engineering College (Amazon, TCS Prime, Zoho, Cognizant, etc.)
// Includes expected Staff Engineer answers, Big-O bounds, counter-probes, and
// live code/SQL starter templates for the embedded scratchpad.
// ============================================================================

export const GPREC_COMPANY_INTERVIEW_VAULT = [
  {
    companyId: 'amazon',
    companyName: 'Amazon SDE-1',
    tier: 'Super-Dream (₹28 – ₹45 LPA)',
    recruiterPersona: 'Amazon Bar Raiser',
    accentColor: '#f59e0b',
    questions: [
      {
        id: 'amz_q1',
        title: 'Concurrent LRU Cache with O(1) Operations',
        track: 'Round 1: Screening & DSA Internals',
        type: 'Low-Level Design & Concurrency',
        question: 'Design an in-memory LRU (Least Recently Used) cache with strictly O(1) get and put time complexities. How do you ensure thread safety when multiple worker threads read and evict entries concurrently without a bottlenecking global lock?',
        whyAsked: 'Amazon Bar Raisers use this to verify if you understand internal hash table bucket structures, doubly linked list pointer updates, and fine-grained concurrent locking (ReadWriteLock / StampedLock).',
        hint: 'Use a ConcurrentHashMap for O(1) key lookups and a Doubly Linked List for eviction ordering. Discuss Segment Locking or Striped Locks instead of synchronized(this).',
        modelAnswer: 'An optimal LRU Cache pairs a Hash Table for O(1) key-to-node mapping with a Doubly Linked List to maintain eviction order. To achieve concurrent high throughput without a global lock bottleneck, we use java.util.concurrent.locks.StampedLock or Segmented Striped Locks. Read operations (get) acquire optimistic read locks. Write operations (put/evict) acquire write locks only on the affected hash bucket and node neighbor pointers, ensuring threads on separate keys proceed concurrently without contention.',
        powerPhrases: [
          'Say "Employed optimistic read locks with StampedLock for zero-contention reads" instead of "Made it synchronized".',
          'Say "Doubly linked list allows O(1) arbitrary node deletion and head insertion" instead of "Easily moved items around".',
          'Say "Bounded eviction memory footprint via striped segment locking" instead of "Protected cache with lock".'
        ],
        codeLang: 'java',
        starterCode: `class ConcurrentLRUCache<K, V> {
    private static class Node<K, V> {
        K key; V val;
        Node<K, V> prev, next;
        Node(K k, V v) { this.key = k; this.val = v; }
    }

    private final int capacity;
    private final ConcurrentHashMap<K, Node<K, V>> map;
    private final Node<K, V> head, tail;
    private final ReentrantLock lock = new ReentrantLock();

    public ConcurrentLRUCache(int capacity) {
        this.capacity = capacity;
        this.map = new ConcurrentHashMap<>(capacity);
        this.head = new Node<>(null, null);
        this.tail = new Node<>(null, null);
        head.next = tail;
        tail.prev = head;
    }

    public V get(K key) {
        Node<K, V> node = map.get(key);
        if (node == null) return null;
        lock.lock();
        try {
            moveToHead(node);
        } finally {
            lock.unlock();
        }
        return node.val;
    }

    public void put(K key, V value) {
        lock.lock();
        try {
            Node<K, V> existing = map.get(key);
            if (existing != null) {
                existing.val = value;
                moveToHead(existing);
            } else {
                if (map.size() >= capacity) {
                    Node<K, V> lru = tail.prev;
                    removeNode(lru);
                    map.remove(lru.key);
                }
                Node<K, V> fresh = new Node<>(key, value);
                map.put(key, fresh);
                addNode(fresh);
            }
        } finally {
            lock.unlock();
        }
    }

    private void moveToHead(Node<K, V> n) { removeNode(n); addNode(n); }
    private void addNode(Node<K, V> n) { n.next = head.next; n.prev = head; head.next.prev = n; head.next = n; }
    private void removeNode(Node<K, V> n) { n.prev.next = n.next; n.next.prev = n.prev; }
}`,
        defaultCounterProbe: 'If 10,000 concurrent threads call get() on the same single hot key (e.g. flash sale item), moveToHead() forces serialization on the lock. How would you redesign this to prevent tail latency spikes?',
        exemplarCounter: 'For ultra-hot keys, we decouple cache reads from LRU order mutation using a lock-free Read Buffer (like Caffeine cache). Reads simply append node access events to a thread-local ring buffer, and a single asynchronous background maintenance thread drains the ring buffers to update linked list pointers in batches, eliminating lock contention on get().'
      },
      {
        id: 'amz_q2',
        title: 'Cache Stampede & Thundering Herd Defense',
        track: 'Round 2: System Architecture & LLD',
        type: 'High Scalability & Distributed Systems',
        question: 'Suppose you have a Redis cluster caching product pricing. A flash sale starts and 500,000 requests per second hit a single product ID. Suddenly, its Redis TTL expires. What catastrophic failure occurs, and what architectural pattern prevents it?',
        whyAsked: 'Tests distributed systems survivability, understanding of Cache Stampede / Thundering Herd, and database connection pool protection.',
        hint: 'Discuss the Thundering Herd / Cache Stampede effect where all 500K requests simultaneously query the downstream database. Propose Distributed Mutex (Redis Redlock), Probabilistic Early Expiration (XFetch), or Background Refresh.',
        modelAnswer: 'When a hot cache key expires under heavy traffic, all 500,000 concurrent requests miss Redis simultaneously and hammer the primary PostgreSQL database, causing connection pool exhaustion, CPU saturation, and cascading service outages. This is known as a Cache Stampede (or Thundering Herd). We resolve this using two defense layers: First, Mutex Locking: only the first thread that misses the cache acquires a distributed Redis lock (SETNX key lock_token PX 2000) to query the database and re-populate the cache; all other threads sleep for 50ms and retry Redis. Second, Probabilistic Early Expiration (XFetch algorithm): a background worker re-fetches the record before TTL reaches 0 based on access delta, ensuring the cache is never empty.',
        powerPhrases: [
          'Say "Prevented database thread pool collapse via distributed mutex locking (SETNX with TTL)" instead of "Locked the database query".',
          'Say "Employed probabilistic early cache re-computation (XFetch)" instead of "Updated cache before it died".',
          'Say "Absorbed stampede surges with degraded stale fallback payloads" instead of "Showed an error".'
        ],
        codeLang: 'python',
        starterCode: `import time
import math
import random

def get_product_with_xfetch(redis_client, db_client, key: str, beta: float = 1.0):
    """
    XFetch Probabilistic Early Expiration algorithm.
    Refreshes hot cache in background before TTL reaches 0.
    """
    item = redis_client.get(key)
    now = time.time()
    
    if item is not None:
        val, delta, expiry = item # delta = computation time, expiry = epoch timestamp
        # Optimal probabilistic condition: -beta * delta * ln(random()) >= remaining_ttl
        remaining_ttl = expiry - now
        if remaining_ttl > 0:
            if (-beta * delta * math.log(random.random())) < remaining_ttl:
                return val # Serve hot cached value
                
    # Either cache miss or probabilistic early refresh triggered
    t0 = time.time()
    fresh_val = db_client.query_product(key)
    delta = time.time() - t0
    ttl = 120 # 2 minutes
    redis_client.set(key, (fresh_val, delta, now + ttl), ttl=ttl)
    return fresh_val`,
        defaultCounterProbe: 'If the distributed lock holder crashes while holding the Redis lock, how do you prevent all 500k requests from hanging indefinitely waiting for the lock?',
        exemplarCounter: 'Every distributed lock MUST be acquired with an atomic lease TTL (SETNX ... PX 1500) and a randomized UUID token. If the worker crashes, Redis automatically releases the lock when the lease expires. Additionally, client threads use a bounded timeout (e.g. 100ms) with jitter, after which they fall back to returning a stale cached copy rather than blocking indefinitely.'
      },
      {
        id: 'amz_q3',
        title: 'DynamoDB Partition Key Distribution & Hot Partition Elimination',
        track: 'Round 2: System Architecture & LLD',
        type: 'Database Architecture & Partitioning',
        question: 'In Amazon DynamoDB or Cassandra, how does the storage engine distribute data across physical storage nodes? What is a "Hot Partition" problem, and how do you design partition keys to prevent write throttling under 50,000 RPS?',
        whyAsked: 'Core Amazon AWS architecture viva question testing hashing ring fundamentals, token ranges, and write sharding techniques.',
        hint: 'Discuss consistent hashing over partition key hashes. If all orders share the same date partition key, one physical SSD gets throttled. Explain Partition Key Salting / Suffixing.',
        modelAnswer: 'DynamoDB determines the physical storage partition by hashing the Partition Key (PK) using MD5/MurmurHash3 onto an internal hash ring. If an application uses an un-sharded timestamp or status (e.g. PK = "2026-11-19") for 50,000 RPS, all writes route to the exact same physical partition node, exceeding its 1,000 WCU (Write Capacity Units) limit and triggering HTTP 400 ProvisionedThroughputExceededException. We eliminate hot partitions via Partition Key Salting: appending a pseudo-random suffix (PK = "2026-11-19." + random(0, 50)). Writes distribute uniformly across 50 separate partition nodes, scaling write throughput to 50,000 RPS seamlessly.',
        powerPhrases: [
          'Say "Uniform hash ring distribution via partition key salting (random suffixing)" instead of "Spread keys randomly".',
          'Say "Eliminated physical storage node throttling under 1,000 WCU boundary" instead of "Avoided slow queries".',
          'Say "Scattered-gather parallel queries across salted partition keys" instead of "Read all parts".'
        ],
        codeLang: 'javascript',
        starterCode: `// High-Throughput DynamoDB Partition Key Salter
const NUM_SHARDS = 32;

function generateSaltedPartitionKey(baseKey) {
  const randomShard = Math.floor(Math.random() * NUM_SHARDS);
  return \`\${baseKey}#shard_\${randomShard}\`;
}

async function queryAllSaltedPartitions(baseKey, ddbClient) {
  // Scatter-gather parallel queries across all salted shards
  const queries = Array.from({ length: NUM_SHARDS }, (_, shardId) => {
    const pk = \`\${baseKey}#shard_\${shardId}\`;
    return ddbClient.query({ TableName: 'Orders', KeyConditionExpression: 'PK = :pk', ExpressionAttributeValues: { ':pk': pk } });
  });

  const results = await Promise.all(queries);
  return results.flatMap(res => res.Items || []);
}`,
        defaultCounterProbe: 'When you salt partition keys across 32 shards, read queries now have to query 32 separate partitions and merge them (Scatter-Gather). How do you handle pagination and sorting across these 32 streams?',
        exemplarCounter: 'We maintain a Min-Heap (K-Way Merge) over the 32 query iterator cursors, sorting by the range key (timestamp). Each page request polls the min element from the heap in O(log 32) time, preserving globally sorted order without buffering all partition results in memory.'
      }
    ]
  },
  {
    companyId: 'tcs_prime',
    companyName: 'TCS Digital / Prime',
    tier: 'Premier Digital (₹7.5 – ₹9.0 LPA)',
    recruiterPersona: 'TCS Prime / Digital',
    accentColor: '#4f46e5',
    questions: [
      {
        id: 'tcs_q1',
        title: 'B+ Tree Indexing vs Hash Indexing Internal Storage Mechanics',
        track: 'Round 1: Screening & DSA Internals',
        type: 'Database Engine Mechanics',
        question: 'Why do relational database engines (PostgreSQL InnoDB, MySQL) use B+ Trees instead of B-Trees or Hash Tables for indexing primary and secondary keys? What happens internally on disk when an index node splits?',
        whyAsked: 'TCS Digital / Prime evaluators look for deep systems engineering, understanding of disk block page reads (4KB/8KB), and range query performance.',
        hint: 'Hash tables cannot do range queries (BETWEEN, >, <). B+ Trees store all data/pointers exclusively in leaf nodes linked by bidirectional pointers. Explain disk page I/O reduction.',
        modelAnswer: 'Relational databases favor B+ Trees over Hash tables because hash indexes only support O(1) exact equality lookups (WHERE id = 5) and cannot execute range queries (BETWEEN, <, >, ORDER BY). B+ Trees improve upon standard B-Trees by storing satellite data records and record pointers exclusively in leaf nodes; non-leaf internal nodes store only routing keys, allowing hundreds of keys to fit inside a single 8KB disk page. Furthermore, leaf nodes are linked in a continuous doubly linked list, enabling O(log N) initial seek followed by sequential disk I/O scan. When an insert fills an 8KB leaf page past 100%, the engine allocates a new disk page, splits the node 50/50, and pushes the median key up to the parent page.',
        powerPhrases: [
          'Say "Maximized disk page fan-out ratio by storing data pointers strictly in leaf nodes" instead of "Stored pointers in leaves".',
          'Say "Enabled high-speed sequential disk I/O range scans via doubly linked leaf pages" instead of "Scanned through nodes easily".',
          'Say "Amortized page split rebalancing with WAL (Write-Ahead Log) durability" instead of "Added new pages safely".'
        ],
        codeLang: 'sql',
        starterCode: `-- Analytical Range Query Leveraging B+ Tree Leaf Page Ordering
EXPLAIN ANALYZE
SELECT 
    student_id,
    assessment_score,
    submission_timestamp
FROM gprec_scholar_assessments
WHERE submission_timestamp >= NOW() - INTERVAL '7 days'
  AND assessment_score >= 80
ORDER BY submission_timestamp DESC;

-- Composite B+ Tree Covering Index:
-- High-cardinality timestamp first for range seek, score included to avoid heap lookups
CREATE INDEX idx_assessments_time_score 
ON gprec_scholar_assessments (submission_timestamp DESC, assessment_score);`,
        defaultCounterProbe: 'If you have a table with frequent INSERTS of monotonically increasing IDs (auto-increment BIGSERIAL), what is the B+ tree page fill factor and how do you prevent right-most page lock contention?',
        exemplarCounter: 'With sequential keys, standard 50/50 page splits are inefficient. Modern engines detect right-append patterns and perform 90/10 asymmetric page splits to maintain 90%+ storage density. To alleviate latch contention on the right-most page, modern engines use optimistic latch coupling and lock-free append buffers.'
      },
      {
        id: 'tcs_q2',
        title: 'Java Concurrency: Synchronized vs ReentrantLock vs StampedLock',
        track: 'Round 1: Screening & DSA Internals',
        type: 'Language Internals & Multithreading',
        question: 'In Java, how does the intrinsic monitor lock (synchronized) differ internally from ReentrantLock and StampedLock? When would synchronized cause thread starvation, and how does ReentrantLock prevent it?',
        whyAsked: 'Standard TCS Prime elimination question separating basic Java programmers from advanced enterprise backend candidates.',
        hint: 'synchronized relies on JVM object headers (Mark Word) and OS mutexes. ReentrantLock uses AQS (AbstractQueuedSynchronizer) with fair/unfair FIFO queues and timeout lock attempts (tryLock).',
        modelAnswer: 'The synchronized keyword uses intrinsic monitor locks stored in the JVM object header Mark Word (biased locking -> lightweight CAS -> heavyweight OS mutex). However, synchronized is non-interruptible, cannot attempt a timed acquisition, and does not guarantee fairness, which can starve waiting threads under heavy contention. ReentrantLock, built on AbstractQueuedSynchronizer (AQS), provides explicit lock() and unlock() semantics, interruptible locking (lockInterruptibly), timed attempts (tryLock(100, TimeUnit.MILLISECONDS)), and optional fairness (FIFO queue). StampedLock takes this further by offering optimistic read validation (validate(stamp)), achieving near zero lock overhead when writes are infrequent.',
        powerPhrases: [
          'Say "Avoided thread starvation using AQS FIFO queue with fair locking policy" instead of "Kept threads orderly".',
          'Say "Prevented deadlock with timed tryLock backoff mechanisms" instead of "Did not wait forever".',
          'Say "Optimistic read validation with StampedLock for near-zero latency" instead of "Read data without locking".'
        ],
        codeLang: 'java',
        starterCode: `public class BankAccountTransfer {
    private final ReentrantLock lock = new ReentrantLock(true); // Fair ordering to prevent starvation
    private double balance;

    public BankAccountTransfer(double initialBalance) {
        this.balance = initialBalance;
    }

    public boolean safeWithdrawWithTimeout(double amount, long timeoutMs) throws InterruptedException {
        // Non-blocking timed lock acquisition to eliminate deadlock risks
        if (lock.tryLock(timeoutMs, TimeUnit.MILLISECONDS)) {
            try {
                if (balance >= amount) {
                    balance -= amount;
                    return true;
                }
                return false;
            } finally {
                lock.unlock(); // Always release in finally block
            }
        }
        return false; // Could not acquire lock in time; graceful fallback
    }
}`,
        defaultCounterProbe: 'Why does ReentrantLock default to non-fair mode (false), and what is the throughput penalty when you enable fair locking (true)?',
        exemplarCounter: 'Non-fair mode allows a running thread that just released the lock to reacquire it immediately (barging), maximizing CPU cache affinity and avoiding costly OS thread context switches (2-5 microseconds each). Fair mode enforces strict FIFO queuing, which can drop overall throughput by 5x to 10x due to continuous thread parking and unparking.'
      }
    ]
  },
  {
    companyId: 'zoho',
    companyName: 'Zoho Corporation',
    tier: 'Product Core (₹8.5 – ₹12 LPA)',
    recruiterPersona: 'Zoho Corporation',
    accentColor: '#dc2626',
    questions: [
      {
        id: 'zoho_q1',
        title: 'String Constant Pool vs Heap Allocation & Garbage Collection',
        track: 'Round 1: Screening & DSA Internals',
        type: 'Memory Management & JVM Internals',
        question: 'Explain the exact memory difference between String s1 = "Zoho" and String s2 = new String("Zoho"). What is the String Constant Pool (SCP), in which JVM generation does it reside, and what happens when you invoke s2.intern()?',
        whyAsked: 'Zoho strictly evaluates core language fundamentals and raw memory management without depending on external libraries.',
        hint: 'String literals live in the SCP (Heap memory since Java 7). new String() creates an object on the general heap AND ensures the literal exists in SCP. intern() returns the canonical pool reference.',
        modelAnswer: 'When declaring String s1 = "Zoho", the JVM checks the String Constant Pool (SCP) in heap memory. If "Zoho" exists, s1 points directly to it; if not, a new literal object is created in SCP. However, String s2 = new String("Zoho") unconditionally allocates a new String object on the general Young Generation heap, holding a pointer to the SCP literal character array, thus consuming duplicate memory. Invoking s2.intern() searches the SCP: if a matching string exists, it returns the reference from the pool; otherwise, it registers s2 into the SCP. Comparing s1 == s2 yields false, but s1 == s2.intern() yields true.',
        powerPhrases: [
          'Say "Avoided unnecessary heap allocations by reusing interned String Constant Pool references" instead of "Reused strings".',
          'Say "Prevented heap bloat and premature GC promotion during high-throughput string parsing" instead of "Saved RAM".',
          'Say "Referential equality check (==) on canonical interned references executes in O(1)" instead of "Checked string match quickly".'
        ],
        codeLang: 'java',
        starterCode: `public class ZohoStringMemoryTest {
    public static void main(String[] args) {
        String s1 = "Zoho"; // Stored in String Constant Pool (SCP)
        String s2 = new String("Zoho"); // New Heap object pointing to SCP char[]
        String s3 = s2.intern(); // Returns canonical reference from SCP

        System.out.println("s1 == s2: " + (s1 == s2)); // false (Different heap references)
        System.out.println("s1 == s3: " + (s1 == s3)); // true (Both point to identical SCP instance)
        System.out.println("s1.equals(s2): " + s1.equals(s2)); // true (Content equality)
    }
}`,
        defaultCounterProbe: 'In older Java versions (Java 6 and earlier), where was the String Constant Pool located, and why did massive string interning cause catastrophic OutOfMemoryErrors?',
        exemplarCounter: 'In Java 6 and earlier, the SCP resided in Permanent Generation (PermGen), a fixed-size memory space outside the regular heap that was rarely garbage collected. Interning millions of strings quickly exhausted PermGen, triggering java.lang.OutOfMemoryError: PermGen space. In Java 7+, SCP was relocated to the main garbage-collected heap.'
      },
      {
        id: 'zoho_q2',
        title: 'Floyd\'s Cycle-Finding Algorithm & Loop Start Detection',
        track: 'Round 1: Screening & DSA Internals',
        type: 'Core DSA & Zero-Library Implementation',
        question: 'Given a singly linked list that may contain a circular reference loop, how do you detect the cycle in O(N) time and strictly O(1) auxiliary space? Once detected, mathematically prove how you find the exact node where the cycle starts.',
        whyAsked: 'Zoho Round 2 & Round 3 classic viva question testing pointer arithmetic, formal mathematical induction, and zero-library coding.',
        hint: 'Use Floyd\'s Tortoise and Hare (slow = slow.next, fast = fast.next.next). When they meet, reset one pointer to head and advance both 1 step at a time.',
        modelAnswer: 'We use Floyd\'s Cycle-Finding (Tortoise and Hare) algorithm. We initialize two pointers: slow moves 1 step at a time, fast moves 2 steps. If fast or fast.next reaches null, the list is acyclic. If a cycle exists, fast will inevitably overlap slow within the cycle. Mathematical proof for loop start: Let L1 be distance from head to loop entry, L2 be distance from loop entry to meeting point, and C be loop circumference. When they meet, slow traveled L1 + L2, fast traveled L1 + L2 + nC. Since fast moves twice as fast: 2(L1 + L2) = L1 + L2 + nC => L1 = nC - L2. Therefore, if we reset slow to the head and keep fast at the meeting point, moving both 1 step at a time, they will meet precisely at the loop entry node after L1 steps.',
        powerPhrases: [
          'Say "Strict O(1) space complexity without auxiliary hash sets" instead of "Did not use extra memory".',
          'Say "Floyd\'s Tortoise and Hare pointer divergence and convergence proof" instead of "Fast and slow pointers".',
          'Say "Eliminated infinite traversal loops in linked structures" instead of "Fixed the loop".'
        ],
        codeLang: 'java',
        starterCode: `class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; next = null; }
}

public class Solution {
    public ListNode detectCycle(ListNode head) {
        if (head == null || head.next == null) return null;

        ListNode slow = head;
        ListNode fast = head;

        // Step 1: Detect cycle existence
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                // Step 2: Find cycle entry node
                ListNode entry = head;
                while (entry != slow) {
                    entry = entry.next;
                    slow = slow.next;
                }
                return entry; // Exact loop starting node
            }
        }
        return null; // Acyclic
    }
}`,
        defaultCounterProbe: 'How would you break or remove the cycle without modifying node values, so the linked list becomes a standard acyclic list ending with null?',
        exemplarCounter: 'Once the entry node is located, we advance a pointer around the cycle until pointer.next == entry. We then set pointer.next = null, severing the circular reference and restoring the list to an acyclic terminal state.'
      }
    ]
  },
  {
    companyId: 'cognizant',
    companyName: 'Cognizant GenC Next',
    tier: 'Product Track (₹6.75 – ₹9.0 LPA)',
    recruiterPersona: 'Cognizant GenC Next',
    accentColor: '#0284c7',
    questions: [
      {
        id: 'cog_q1',
        title: 'SQL Window Functions: ROW_NUMBER vs RANK vs DENSE_RANK',
        track: 'Round 1: Screening & DSA Internals',
        type: 'Advanced SQL & Data Analytics',
        question: 'Explain the critical behavioral difference between ROW_NUMBER(), RANK(), and DENSE_RANK() in SQL. Write a single production query to find the 2nd highest salary in each department, correctly handling duplicate salary ties.',
        whyAsked: 'Cognizant GenC Next and TCS Prime standard technical assessment question testing analytical SQL mastery without inefficient correlated subqueries.',
        hint: 'ROW_NUMBER assigns distinct consecutive integers (1,2,3). RANK leaves gaps on ties (1,1,3). DENSE_RANK assigns consecutive ranks without gaps on ties (1,1,2). Use DENSE_RANK() with CTE.',
        modelAnswer: 'The distinction between SQL window ranking functions lies in tie handling: ROW_NUMBER() assigns strictly consecutive distinct integers (1, 2, 3, 4) ignoring ties; RANK() assigns identical ranks to ties but skips subsequent rank numbers (1, 1, 3, 4); DENSE_RANK() assigns identical ranks to ties without skipping subsequent numbers (1, 1, 2, 3). For retrieving the 2nd highest salary per department, DENSE_RANK() is mandatory: if two top earners share ₹15 LPA (tied rank 1), the subsequent earner with ₹12 LPA is correctly assigned rank 2, whereas RANK() would have assigned rank 3 and missed them entirely.',
        powerPhrases: [
          'Say "Partitioned analytical windowing via DENSE_RANK() over department partitions" instead of "Grouped by department".',
          'Say "Eliminated O(N^2) correlated subquery execution plans" instead of "Avoided slow subqueries".',
          'Say "Preserved contiguous rank density during salary tie collisions" instead of "Handled ties properly".'
        ],
        codeLang: 'sql',
        starterCode: `-- Find 2nd Highest Salary per Department with Ties Preserved
WITH RankedEmployees AS (
    SELECT 
        employee_id,
        employee_name,
        department_id,
        salary,
        DENSE_RANK() OVER (
            PARTITION BY department_id 
            ORDER BY salary DESC
        ) AS salary_rank
    FROM employees
    WHERE status = 'ACTIVE'
)
SELECT 
    department_id,
    employee_id,
    employee_name,
    salary
FROM RankedEmployees
WHERE salary_rank = 2
ORDER BY department_id, employee_name;`,
        defaultCounterProbe: 'If a department only has 1 employee, this query returns 0 rows for that department. How would you modify it to return NULL or the 1st salary if no 2nd salary exists?',
        exemplarCounter: 'We outer join a distinct list of departments with the ranked CTE, or wrap the CTE selection inside a COALESCE((SELECT salary FROM RankedEmployees WHERE salary_rank = 2), (SELECT MAX(salary) FROM employees WHERE department_id = d.id)), ensuring a fallback value is always produced.'
      },
      {
        id: 'cog_q2',
        title: 'REST API Idempotency & Payment Duplicate Prevention',
        track: 'Round 2: System Architecture & LLD',
        type: 'API Design & Enterprise Integration',
        question: 'Why are HTTP GET, PUT, and DELETE methods idempotent while POST is not? In a payment processing gateway, what happens if a mobile client loses connection after clicking "Pay ₹5,000" and retries the POST request? How do you guarantee idempotency?',
        whyAsked: 'Core API architectural question in Cognizant and Accenture technical interviews testing transactional guarantees and distributed state.',
        hint: 'An idempotent operation produces the same server state regardless of whether called once or 10 times. Solve duplicate payment via Idempotency-Key headers stored in Redis/DB with unique constraints.',
        modelAnswer: 'An HTTP method is idempotent if executing it multiple times produces the identical server resource state as executing it once. GET is safe and idempotent (read-only). PUT is idempotent because replacing a resource at a given URI with state X multiple times leaves state X. DELETE is idempotent because deleting an entity leaves it deleted. In contrast, POST appends a new subordinate resource each time, causing duplicate records. In payment systems, if a network timeout occurs during POST /payments, client retries would charge the customer multiple times. We guarantee idempotency by requiring an "Idempotency-Key" header containing a client-generated UUID. When the server receives the request, it attempts an atomic insert of the key into Redis or PostgreSQL with a short TTL (10 minutes) and status "PROCESSING". If a duplicate key arrives, the server immediately returns HTTP 409 or the cached payment response without re-triggering the transaction.',
        powerPhrases: [
          'Say "Enforced distributed idempotency via client UUID Idempotency-Key headers" instead of "Checked if payment already happened".',
          'Say "Guaranteed atomic deduplication with Redis SETNX and short-lived lease TTL" instead of "Saved payment id in Redis".',
          'Say "Returned cached transaction outcomes for replayed network packets" instead of "Did not charge twice".'
        ],
        codeLang: 'javascript',
        starterCode: `// Express / Node.js Distributed Idempotency Middleware
async function idempotencyMiddleware(req, res, next) {
  const idempotencyKey = req.header('Idempotency-Key');
  if (!idempotencyKey) {
    return res.status(400).json({ error: 'Missing Idempotency-Key header' });
  }

  const cacheKey = \`idempotency:\${idempotencyKey}\`;
  
  // Atomic SET with NX (not exists) and 600s TTL
  const acquired = await redisClient.set(cacheKey, JSON.stringify({ status: 'PROCESSING' }), 'NX', 'EX', 600);
  
  if (!acquired) {
    // Duplicate request detected; fetch existing outcome
    const cached = await redisClient.get(cacheKey);
    const parsed = JSON.parse(cached || '{}');
    if (parsed.status === 'COMPLETED') {
      return res.status(200).json(parsed.response);
    }
    return res.status(409).json({ error: 'Transaction currently in progress. Please retry.' });
  }

  // Intercept response to cache outcome upon completion
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    redisClient.set(cacheKey, JSON.stringify({ status: 'COMPLETED', response: body }), 'EX', 600);
    return originalJson(body);
  };

  next();
}`,
        defaultCounterProbe: 'What happens if the server crashes in the middle of executing the payment after writing "PROCESSING" to Redis? How does the retry recover?',
        exemplarCounter: 'We implement a two-phase check: on retry, if status is "PROCESSING" and more than 30 seconds have elapsed, the server queries the downstream payment gateway (e.g. Razorpay/Stripe) by external reference ID to check if the charge settled. If settled, it records "COMPLETED"; if never initiated, it releases the lock and executes the charge safely.'
      }
    ]
  }
];
