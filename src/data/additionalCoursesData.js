// Additional Core Engineering Courses Registry for Lumixora
// 1. AI, Machine Learning & Data Science Mastery
// 2. Cloud Computing, Kubernetes & DevOps Architecture
// 3. Cybersecurity, Network Defense & Ethical Hacking
// 4. Cross-Platform Mobile Engineering (Flutter & React Native)

export const ADDITIONAL_COURSES = [
  {
    "id": "course-aiml-datascience-mastery",
    "title": "Artificial Intelligence, Deep Learning & Generative AI Mastery",
    "category": "aiml",
    "level": "Comprehensive",
    "duration": "55 Hours",
    "rating": 4.95,
    "enrolledCount": 1840,
    "instructor": "Lumixora Autonomous Academic Board & AI Research Group",
    "badgeIcon": "🤖",
    "badgeColor": "from-purple-500 to-indigo-600",
    "shortDescription": "End-to-end AI specialization covering PyTorch, Transformers, Large Language Models (LLMs), RAG pipelines, and MLOps.",
    "certTitle": "Artificial Intelligence & Generative AI Course Mastery",
    "certCategory": "AI & Machine Learning",
    "skills": [
      "PyTorch & Deep Learning",
      "Transformer Architecture & Attention",
      "RAG & Vector Embeddings",
      "Model Quantization & MLOps"
    ],
    "modules": [
      {
        "id": "mod-aiml-1",
        "title": "Module 1: Foundations of Machine Learning & Deep Neural Networks",
        "duration": "14 Hours",
        "lessons": [
          {
            "id": "les-aiml-1-1",
            "title": "Matrix Calculus, Gradient Descent & Backpropagation Mathematics",
            "type": "video",
            "duration": "45 mins",
            "summary": "Mathematical rigor of stochastic gradient descent (SGD), AdamW, backprop computational graphs, and loss landscape dynamics.",
            "textbook": {
              "chapterNumber": "Chapter 1.1",
              "readingTime": "20 mins read",
              "keyTakeaways": [
                "Backpropagation is dynamic programming applied to the chain rule of calculus across an acyclic computational graph.",
                "AdamW decouples L2 weight decay regularization from gradient-based adaptive learning rate momentum.",
                "Vanishing/exploding gradients are mitigated via residual connections, LayerNorm, and He/Xavier weight initialization."
              ],
              "sections": [
                {
                  "heading": "1. Computational Graphs & Reverse-Mode Automatic Differentiation",
                  "content": "Modern deep learning frameworks like PyTorch construct Directed Acyclic Graphs (DAGs) of mathematical tensor operations. In the forward pass, intermediate activation values are saved. In the backward pass, reverse-mode automatic differentiation walks backwards from the scalar loss L, accumulating partial derivatives at each node in linear time O(V + E) relative to graph size.",
                  "formula": "d(L)/d(W) = sum_k [ d(L)/d(y_k) * d(y_k)/d(W) ] via Tensor Jacobian Chain Rule",
                  "code": "import torch\nimport torch.nn as nn\n\n# Dynamic computational graph with explicit autograd tracking\nw = torch.tensor([2.0, -1.0], requires_grad=True)\nx = torch.tensor([1.5, 3.0])\ny = torch.dot(w, x)\nloss = (y - 5.0) ** 2\nloss.backward()\nprint('Gradients dl/dw:', w.grad)",
                  "language": "python",
                  "proTip": "Always wrap evaluation and inference loops in `torch.no_grad()` or `torch.inference_mode()` to prevent PyTorch from retaining memory-heavy computation graphs in VRAM."
                },
                {
                  "heading": "2. Modern Optimizers: SGD vs Adam vs AdamW",
                  "content": "While basic SGD updates weights via eta * grad, Adam maintains exponential moving averages of both past gradients (m_t, 1st moment) and squared gradients (v_t, 2nd moment). AdamW fixes a subtle flaw in standard Adam where weight decay was added to the gradient before moment estimation, ensuring true decoupled L2 regularization.",
                  "formula": "AdamW Update: theta_{t+1} = theta_t - eta * lambda * theta_t - (eta / (sqrt(v_hat_t) + eps)) * m_hat_t",
                  "code": "optimizer = torch.optim.AdamW(model.parameters(), lr=3e-4, weight_decay=1e-2, betas=(0.9, 0.95))\nscheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=10000)",
                  "language": "python"
                }
              ]
            }
          },
          {
            "id": "les-aiml-1-2",
            "title": "Convolutional Networks, Residual Architectures & Vision Backbones",
            "type": "video",
            "duration": "50 mins",
            "summary": "Spatial feature hierarchies, 2D convolution kernels, ResNet skip connections, and modern ConvNeXt architectures.",
            "textbook": {
              "chapterNumber": "Chapter 1.2",
              "readingTime": "18 mins read",
              "keyTakeaways": [
                "Residual skip connections allow gradients to flow directly back through identity shortcuts without vanishing.",
                "Receptive field expands exponentially with stacked 3x3 convolutions compared to large kernel sizes.",
                "Batch Normalization introduces inter-sample dependency during training; LayerNorm or GroupNorm are preferred for varying batch sizes."
              ],
              "sections": [
                {
                  "heading": "1. The Residual Bottleneck Block",
                  "content": "Deep networks prior to ResNet suffered from the degradation problem: adding layers led to higher training error due to optimization difficulties. By learning residual mapping F(x) = H(x) - x, the network can easily learn an identity function if a layer is unneeded, allowing architectures to scale to hundreds of layers.",
                  "formula": "Residual Output: y = F(x, {W_i}) + x",
                  "code": "class ResidualBlock(nn.Module):\n    def __init__(self, channels):\n        super().__init__()\n        self.conv1 = nn.Conv2d(channels, channels, kernel_size=3, padding=1, bias=False)\n        self.norm1 = nn.BatchNorm2d(channels)\n        self.act = nn.GELU()\n        self.conv2 = nn.Conv2d(channels, channels, kernel_size=3, padding=1, bias=False)\n        self.norm2 = nn.BatchNorm2d(channels)\n    def forward(self, x):\n        return x + self.norm2(self.conv2(self.act(self.norm1(self.conv1(x)))))",
                  "language": "python"
                }
              ]
            }
          }
        ]
      },
      {
        "id": "mod-aiml-2",
        "title": "Module 2: Transformer Architectures, Attention Mechanisms & LLMs",
        "duration": "16 Hours",
        "lessons": [
          {
            "id": "les-aiml-2-1",
            "title": "Scaled Dot-Product & Multi-Head Self-Attention Deconstructed",
            "type": "video",
            "duration": "55 mins",
            "summary": "Query, Key, Value tensor projections, softmax scaling factor sqrt(d_k), causal masking, and FlashAttention memory optimization.",
            "textbook": {
              "chapterNumber": "Chapter 2.1",
              "readingTime": "22 mins read",
              "keyTakeaways": [
                "Attention mechanism allows arbitrary token-to-token contextual routing in O(1) sequential step, replacing recurrent loops.",
                "Softmax scaling by 1/sqrt(d_k) prevents logits from exploding into regions with vanishingly small gradients.",
                "FlashAttention computes exact softmax without writing the intermediate N x N attention matrix to GPU HBM, achieving massive speedups."
              ],
              "sections": [
                {
                  "heading": "1. Multi-Head Attention Mathematics",
                  "content": "Given sequence length N and embedding dimension d_model, input embeddings are projected into Q, K, V matrices. Scaled dot-product attention computes similarity between Q and K^T, normalizes via softmax, and computes a weighted average of V. Multi-Head Attention divides d_model into h heads of dimension d_k = d_model / h.",
                  "formula": "Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) + M ) * V",
                  "code": "import math\n\ndef scaled_dot_product_attention(q, k, v, mask=None):\n    d_k = q.size(-1)\n    scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(d_k)\n    if mask is not None:\n        scores = scores.masked_fill(mask == 0, -1e9)\n    attn_weights = torch.softmax(scores, dim=-1)\n    return torch.matmul(attn_weights, v)",
                  "language": "python"
                }
              ]
            }
          },
          {
            "id": "les-aiml-2-2",
            "title": "Retrieval-Augmented Generation (RAG), Vector Embeddings & Quantization",
            "type": "video",
            "duration": "50 mins",
            "summary": "Dense vector retrieval, cosine similarity indexing, HNSW graphs, prompt grounding, and 4-bit/8-bit weight quantization (AWQ/GGUF).",
            "textbook": {
              "chapterNumber": "Chapter 2.2",
              "readingTime": "20 mins read",
              "keyTakeaways": [
                "RAG prevents LLM hallucinations by grounding model responses with fresh contextual vector-search chunks.",
                "HNSW (Hierarchical Navigable Small World) enables sub-linear approximate nearest neighbor search across millions of embedding vectors.",
                "Quantization reduces memory footprint from 16-bit float (2 bytes/param) to 4-bit (0.5 byte/param) with minimal perplexity degradation."
              ],
              "sections": [
                {
                  "heading": "1. Production RAG Architecture Pipeline",
                  "content": "A high-performance RAG pipeline ingest documents, chunks them with semantic overlaps, embeds them via dense bi-encoders, and stores them in high-dimensional vector databases. During user queries, cross-encoder rerankers score candidate chunks before dynamic context injection into LLM prompts.",
                  "formula": "Cosine Similarity: sim(u, v) = (u . v) / (||u||_2 * ||v||_2)",
                  "code": "# Production Semantic RAG Chunking and Retrieval Pattern\nfrom typing import List\nimport numpy as np\n\ndef cosine_similarity(query_emb: np.ndarray, doc_embs: np.ndarray) -> np.ndarray:\n    dot_product = np.dot(doc_embs, query_emb)\n    norms = np.linalg.norm(doc_embs, axis=1) * np.linalg.norm(query_emb)\n    return dot_product / np.maximum(norms, 1e-8)",
                  "language": "python"
                }
              ]
            }
          }
        ]
      }
    ],
    "grandTest": {
      "totalQuestions": 10,
      "passingScore": 80,
      "timeLimit": 20,
      "questions": [
        {
          "id": "gt_aiml_1",
          "level": "Level 1: Fundamentals",
          "topic": "Loss Functions & Backprop",
          "question": "Why is cross-entropy loss preferred over mean squared error (MSE) for multi-class classification with softmax?",
          "options": [
            "Cross-entropy combined with softmax yields linear gradient differences without saturated plateau regions",
            "MSE cannot be computed on tensors",
            "Softmax produces values larger than 1.0",
            "Cross-entropy requires no derivatives"
          ],
          "correct": 0,
          "explanation": "When combined with softmax, the derivative of categorical cross-entropy simplifies to `p_i - y_i`, eliminating gradient vanishing at saturated predictions."
        },
        {
          "id": "gt_aiml_2",
          "level": "Level 1: Fundamentals",
          "topic": "Transformers",
          "question": "In Scaled Dot-Product Attention, why are dot products divided by sqrt(d_k)?",
          "options": [
            "To prevent large dot product magnitudes from pushing the softmax function into regions with extremely small gradients",
            "To convert the matrix into complex numbers",
            "To reduce the matrix dimension from 3D to 2D",
            "To invert the matrix for GPU scheduling"
          ],
          "correct": 0,
          "explanation": "For large d_k, dot products grow large in magnitude, driving softmax into saturated regions with near-zero gradients. Dividing by sqrt(d_k) preserves unit variance."
        },
        {
          "id": "gt_aiml_3",
          "level": "Level 2: Architecture",
          "topic": "FlashAttention",
          "question": "What primary hardware bottleneck does FlashAttention overcome on modern GPUs?",
          "options": [
            "High-bandwidth memory (HBM) read/write traffic by tiling computations within fast on-chip SRAM",
            "CPU clock frequency limits",
            "PCIe bandwidth during hard drive access",
            "Floating point rounding errors"
          ],
          "correct": 0,
          "explanation": "FlashAttention tiles the Q, K, V matrices and computes softmax incrementally without materializing the large N x N attention matrix to GPU HBM."
        },
        {
          "id": "gt_aiml_4",
          "level": "Level 2: Architecture",
          "topic": "Optimization",
          "question": "How does AdamW differ from standard Adam with L2 regularization?",
          "options": [
            "AdamW decouples weight decay directly into parameter updates instead of adding it into the gradient momentum moments",
            "AdamW does not use learning rates",
            "AdamW operates only on CPUs",
            "AdamW requires full batch gradient descent"
          ],
          "correct": 0,
          "explanation": "Loshchilov & Hutter showed standard Adam conflates L2 regularization with moving average gradients; AdamW decouples weight decay directly to preserve true regularization strength."
        },
        {
          "id": "gt_aiml_5",
          "level": "Level 2: Practical",
          "topic": "RAG & Vector Search",
          "question": "Which algorithm is most commonly utilized for fast approximate nearest neighbor (ANN) search in production vector databases?",
          "options": [
            "HNSW (Hierarchical Navigable Small World)",
            "Bubble Sort",
            "Dijkstra's Single Source Shortest Path",
            "Kruskal's Minimum Spanning Tree"
          ],
          "correct": 0,
          "explanation": "HNSW constructs a multi-layer graph where upper layers enable fast long-range hops and bottom layers perform fine-grained localized neighbor search in logarithmic time."
        },
        {
          "id": "gt_aiml_6",
          "level": "Level 3: Advanced",
          "topic": "Model Quantization",
          "question": "In 4-bit weight-only quantization (e.g. AWQ), what is the key insight for maintaining high accuracy?",
          "options": [
            "Salient outlier weight channels (representing ~1% of weights) are preserved at higher precision or protected from scaling error",
            "All weights are rounded to 0 or 1",
            "Attention heads are pruned randomly",
            "Activation vectors are discarded"
          ],
          "correct": 0,
          "explanation": "AWQ identifies salient weight channels corresponding to high-magnitude activation features and protects them from aggressive quantization errors."
        },
        {
          "id": "gt_aiml_7",
          "level": "Level 3: Advanced",
          "topic": "RoPE Position Embeddings",
          "question": "What is the primary advantage of Rotary Position Embeddings (RoPE) used in LLaMA and modern LLMs?",
          "options": [
            "It encodes relative token positions through rotation matrices in complex vector space while operating on absolute positions",
            "It eliminates the need for attention masks",
            "It limits context window to 512 tokens",
            "It trains without backpropagation"
          ],
          "correct": 0,
          "explanation": "RoPE multiplies queries and keys by sinusoidal rotation matrices such that their inner product naturally decays with relative token distance."
        },
        {
          "id": "gt_aiml_8",
          "level": "Level 3: Advanced",
          "topic": "Mixture of Experts",
          "question": "In a Sparse Mixture of Experts (MoE) architecture like Mixtral 8x7B, how is computational efficiency achieved?",
          "options": [
            "A learned router network dynamically activates only top-k expert feed-forward sub-networks per token",
            "All parameters are calculated on every single forward pass",
            "Weights are shared identically across all layers",
            "Memory is unloaded to disk between tokens"
          ],
          "correct": 0,
          "explanation": "Sparse MoE gates route each token to a small subset (e.g., 2 out of 8) of experts, keeping active FLOPs low while expanding total model capacity."
        },
        {
          "id": "gt_aiml_9",
          "level": "Level 3: Advanced",
          "topic": "Inference KV Cache",
          "question": "Why is the Key-Value (KV) cache indispensable during autoregressive LLM text generation?",
          "options": [
            "It avoids recomputing key and value tensors for previously generated tokens at each forward generation step",
            "It stores the final answer in hard drive storage",
            "It acts as a firewall against SQL injection",
            "It compresses generated text into zip format"
          ],
          "correct": 0,
          "explanation": "Without a KV cache, generating the N-th token requires O(N^2) total recomputations of all past token attention states; caching reduces per-step compute to O(N)."
        },
        {
          "id": "gt_aiml_10",
          "level": "Level 3: Advanced",
          "topic": "Evaluation & Perplexity",
          "question": "What does a lower validation perplexity indicate regarding an autoregressive language model?",
          "options": [
            "The model assigns higher probability to unseen validation test tokens and predicts text with higher confidence",
            "The model has suffered catastrophic forgetting",
            "The model inference speed is slower",
            "The dataset has corrupted characters"
          ],
          "correct": 0,
          "explanation": "Perplexity is the exponentiated cross-entropy loss `exp(loss)`; lower values mean the model assigns higher likelihood to real human text."
        }
      ]
    }
  },
  {
    "id": "course-cloud-devops-kubernetes",
    "title": "Cloud Architecture, Kubernetes & DevOps Engineering",
    "category": "cloud",
    "level": "Comprehensive",
    "duration": "50 Hours",
    "rating": 4.92,
    "enrolledCount": 1610,
    "instructor": "Lumixora Autonomous Academic Board & Cloud Infrastructure Architects",
    "badgeIcon": "☁️",
    "badgeColor": "from-cyan-500 to-blue-600",
    "shortDescription": "Master Docker containerization, Kubernetes cluster orchestration, CI/CD pipelines, Terraform Infrastructure as Code (IaC), and observability.",
    "certTitle": "Cloud Architecture, Kubernetes & DevOps Mastery",
    "certCategory": "Cloud & DevOps",
    "skills": [
      "Docker & OCI Containers",
      "Kubernetes Orchestration & Helm",
      "Terraform Infrastructure as Code",
      "CI/CD Pipelines & Prometheus Monitoring"
    ],
    "modules": [
      {
        "id": "mod-cloud-1",
        "title": "Module 1: Containerization, Linux Namespaces & Docker Internals",
        "duration": "12 Hours",
        "lessons": [
          {
            "id": "les-cloud-1-1",
            "title": "Linux cgroups, Namespaces, OverlayFS & OCI Container Runtime",
            "type": "video",
            "duration": "45 mins",
            "summary": "How containers actually work inside Linux kernels without virtualization: PID/NET namespaces, control groups v2, and copy-on-write storage layers.",
            "textbook": {
              "chapterNumber": "Chapter 1.1",
              "readingTime": "18 mins read",
              "keyTakeaways": [
                "Containers are not virtual machines; they are standard Linux processes bounded by cgroups and isolated by namespaces.",
                "OverlayFS stacks read-only image layers with a single writable container layer on top.",
                "Multi-stage Docker builds dramatically shrink attack surfaces and reduce final image footprints by orders of magnitude."
              ],
              "sections": [
                {
                  "heading": "1. The Anatomy of Container Isolation",
                  "content": "Linux containers rely on kernel primitives: namespaces isolate system views (PID isolates process trees, NET isolates network interfaces and IP routing tables, MNT isolates mount points). Control Groups (cgroups v2) meter and enforce hard resource limits on CPU cycles, memory caps, and block I/O throughput.",
                  "formula": "Container = Linux Process + Namespaces (Isolation) + Cgroups (Resource Throttling) + OverlayFS (Storage)",
                  "code": "# Production Multi-Stage Distroless Dockerfile\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM gcr.io/distroless/nodejs20-debian12\nWORKDIR /app\nCOPY --from=builder /app/dist ./dist\nCOPY --from=builder /app/node_modules ./node_modules\nUSER nonroot:nonroot\nEXPOSE 3000\nCMD [\"dist/server.js\"]",
                  "language": "dockerfile"
                }
              ]
            }
          }
        ]
      },
      {
        "id": "mod-cloud-2",
        "title": "Module 2: Kubernetes Cluster Architecture, Helm & GitOps",
        "duration": "18 Hours",
        "lessons": [
          {
            "id": "les-cloud-2-1",
            "title": "Control Plane Internals, Pod Scheduling & Service Mesh Routing",
            "type": "video",
            "duration": "55 mins",
            "summary": "Kube-apiserver, etcd quorum consensus, kube-scheduler, kubelet reconciliation loops, and Ingress routing controllers.",
            "textbook": {
              "chapterNumber": "Chapter 2.1",
              "readingTime": "22 mins read",
              "keyTakeaways": [
                "The Kubernetes control plane operates on declarative reconciliation loops comparing desired state vs actual state.",
                "etcd utilizes the Raft consensus algorithm, requiring an odd quorum (2N+1) to tolerate network partitions.",
                "Pod graceful termination sends SIGTERM, waits for terminationGracePeriodSeconds, before issuing non-catchable SIGKILL."
              ],
              "sections": [
                {
                  "heading": "1. Declarative Deployment with High-Availability Constraints",
                  "content": "Kubernetes deployments manage ReplicaSets to ensure guaranteed availability across availability zones. Utilizing Horizontal Pod Autoscalers (HPA) with PodDisruptionBudgets (PDB) ensures that rolling updates maintain minimum operational capacity under zero downtime requirements.",
                  "code": "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: production-api\nspec:\n  replicas: 3\n  strategy:\n    rollingUpdate:\n      maxSurge: 1\n      maxUnavailable: 0\n  template:\n    spec:\n      containers:\n      - name: api\n        image: registry.lumixora.in/api:v1.2\n        resources:\n          limits:\n            cpu: \"500m\"\n            memory: \"512Mi\"\n          requests:\n            cpu: \"100m\"\n            memory: \"128Mi\"",
                  "language": "yaml"
                }
              ]
            }
          }
        ]
      }
    ],
    "grandTest": {
      "totalQuestions": 10,
      "passingScore": 80,
      "timeLimit": 20,
      "questions": [
        {
          "id": "gt_cloud_1",
          "level": "Level 1: Fundamentals",
          "topic": "Containers",
          "question": "What kernel primitive limits how much RAM and CPU cycles a container process can consume?",
          "options": [
            "Control Groups (cgroups)",
            "PID Namespaces",
            "Network Bridge",
            "SELinux Policy"
          ],
          "correct": 0,
          "explanation": "cgroups (control groups) meter, partition, and limit system resource usage (CPU, memory, disk I/O, network) for groups of processes."
        },
        {
          "id": "gt_cloud_2",
          "level": "Level 1: Fundamentals",
          "topic": "Kubernetes",
          "question": "Which Kubernetes component acts as the distributed single source of truth for all cluster state?",
          "options": [
            "etcd",
            "kube-proxy",
            "kubelet",
            "CoreDNS"
          ],
          "correct": 0,
          "explanation": "etcd is a consistent, highly-available key-value data store that persists all Kubernetes configuration and state using Raft consensus."
        },
        {
          "id": "gt_cloud_3",
          "level": "Level 2: Architecture",
          "topic": "Zero Downtime Deployments",
          "question": "In a Kubernetes RollingUpdate strategy, setting `maxUnavailable: 0` guarantees which behavior?",
          "options": [
            "No existing pods will be terminated until newly scheduled replacement pods pass their Readiness probes",
            "The cluster will restart all worker nodes",
            "Traffic is routed directly to the database",
            "Pods will run on the master node"
          ],
          "correct": 0,
          "explanation": "Setting maxUnavailable: 0 guarantees that 100% of the desired pod replica count remains fully operational and serving traffic throughout the deployment."
        },
        {
          "id": "gt_cloud_4",
          "level": "Level 2: Architecture",
          "topic": "Health Probes",
          "question": "What is the key functional difference between a Kubernetes `livenessProbe` and a `readinessProbe`?",
          "options": [
            "Liveness probe restarts an unresponsive container; Readiness probe temporarily stops routing ingress traffic until the app is ready",
            "Liveness probe runs only on startup; Readiness probe runs forever",
            "Readiness probe deletes the Docker image",
            "There is no difference"
          ],
          "correct": 0,
          "explanation": "Liveness determines if the process is deadlocked (triggers container restart); Readiness determines if the process is warm and ready to receive customer network requests."
        },
        {
          "id": "gt_cloud_5",
          "level": "Level 2: Practical",
          "topic": "Terraform State",
          "question": "Why is storing Terraform state in a remote backend (e.g. AWS S3 + DynamoDB or GCS) essential in engineering teams?",
          "options": [
            "It provides distributed state locking to prevent concurrent destructive apply operations and preserves shared team state",
            "It compiles HCL code into C++",
            "It runs Docker containers automatically",
            "It prevents Git commits"
          ],
          "correct": 0,
          "explanation": "Remote backends store state securely in the cloud and use table locks (e.g. DynamoDB) to prevent simultaneous deployments from corrupting infrastructure state."
        },
        {
          "id": "gt_cloud_6",
          "level": "Level 3: Advanced",
          "topic": "Ingress & Service Mesh",
          "question": "In Envoy / Istio service mesh, what pattern handles client-to-service and service-to-service communication?",
          "options": [
            "Sidecar proxy injected alongside each application container in the pod",
            "Monolithic hardware gateway",
            "Direct TCP socket exposure without encryption",
            "Kernel level iptables only without proxies"
          ],
          "correct": 0,
          "explanation": "Service meshes inject a sidecar proxy (Envoy) into every pod, intercepting inbound and outbound traffic to enforce mTLS, circuit breaking, and telemetry."
        },
        {
          "id": "gt_cloud_7",
          "level": "Level 3: Advanced",
          "topic": "Prometheus Monitoring",
          "question": "Prometheus primarily employs which architectural pattern for metrics collection?",
          "options": [
            "Pull-based model scraping HTTP `/metrics` endpoints at scheduled intervals",
            "Push-only streaming UDP model",
            "Polling MySQL database tables directly",
            "Email notifications from servers"
          ],
          "correct": 0,
          "explanation": "Prometheus scrapes (pulls) metrics over HTTP from instrumented endpoints, allowing central discovery and health detection of monitored targets."
        },
        {
          "id": "gt_cloud_8",
          "level": "Level 3: Advanced",
          "topic": "GitOps",
          "question": "In GitOps tools like ArgoCD or Flux, what is the role of the operator?",
          "options": [
            "Continuously reconciling the live cluster state with the desired declarative manifest in a Git repository",
            "Writing application code automatically",
            "Sending SMS alerts to developers",
            "Replacing Kubernetes with virtual machines"
          ],
          "correct": 0,
          "explanation": "GitOps controllers continuously compare Git-declared manifests against live cluster status and automatically heal or synchronize any detected configuration drift."
        },
        {
          "id": "gt_cloud_9",
          "level": "Level 3: Advanced",
          "topic": "Docker Security",
          "question": "Why is running container processes as the non-root user (`USER nonroot` or UID 10001) a critical security practice?",
          "options": [
            "It prevents container escape vulnerabilities from inheriting UID 0 root privileges on the host Linux kernel",
            "It speeds up CPU execution by 50%",
            "It allows the container to bypass firewalls",
            "Docker does not allow root containers to boot"
          ],
          "correct": 0,
          "explanation": "By default, root inside a container maps directly to UID 0 on the host kernel; if an exploit escapes container boundaries, non-root execution restricts host damage."
        },
        {
          "id": "gt_cloud_10",
          "level": "Level 3: Advanced",
          "topic": "Disaster Recovery",
          "question": "What is the difference between RTO (Recovery Time Objective) and RPO (Recovery Point Objective)?",
          "options": [
            "RTO is the maximum tolerable downtime duration; RPO is the maximum tolerable data loss measured in time",
            "RTO measures cloud cost; RPO measures disk space",
            "RTO applies only to networking; RPO applies to frontend code",
            "They are identical terms"
          ],
          "correct": 0,
          "explanation": "RTO measures how quickly systems must be restored after an outage; RPO measures the maximum acceptable age of restored data (data loss tolerance)."
        }
      ]
    }
  },
  {
    "id": "course-cybersecurity-defense-hacking",
    "title": "Cybersecurity, Network Defense & Practical Ethical Hacking",
    "category": "security",
    "level": "Comprehensive",
    "duration": "48 Hours",
    "rating": 4.96,
    "enrolledCount": 1720,
    "instructor": "Lumixora Autonomous Academic Board & Offensive Security Specialists",
    "badgeIcon": "🛡️",
    "badgeColor": "from-red-500 to-rose-600",
    "shortDescription": "Comprehensive security engineering: OWASP Top 10 web vulnerabilities, cryptography, penetration testing, reverse engineering, and defensive hardening.",
    "certTitle": "Cybersecurity & Network Defense Course Mastery",
    "certCategory": "Cybersecurity",
    "skills": [
      "OWASP Top 10 Exploits & Mitigations",
      "Public Key Cryptography & TLS 1.3",
      "Network Penetration Testing (Nmap, Burp)",
      "Linux Hardening & Security Information Management"
    ],
    "modules": [
      {
        "id": "mod-sec-1",
        "title": "Module 1: Web Application Penetration Testing & OWASP Top 10",
        "duration": "14 Hours",
        "lessons": [
          {
            "id": "les-sec-1-1",
            "title": "SQL Injection, Cross-Site Scripting (XSS), CSRF & SSRF In-Depth",
            "type": "video",
            "duration": "50 mins",
            "summary": "Root cause mechanics of injection vulnerabilities, second-order SQLi, DOM-based XSS, Content Security Policy (CSP), and SSRF cloud metadata exploits.",
            "textbook": {
              "chapterNumber": "Chapter 1.1",
              "readingTime": "20 mins read",
              "keyTakeaways": [
                "SQL Injection occurs when untrusted user input is concatenated directly into SQL command strings; parameterized queries eliminate it deterministically.",
                "DOM XSS executes directly inside client browsers when dangerous sinks (e.g. innerHTML) consume untrusted sources (e.g. location.search).",
                "SSRF allows attackers to coerce internal backend servers into making unauthorized requests to internal private APIs or cloud metadata services (169.254.169.254)."
              ],
              "sections": [
                {
                  "heading": "1. Parameterized Queries vs Dynamic Concatenation",
                  "content": "SQL injection is an architectural failure where data and execution control signals are mixed in the same transmission channel. In a prepared statement, the database compiles the SQL statement into an execution tree before parameter values are bound, making code injection mathematically impossible.",
                  "code": "// VULNERABLE: Direct string interpolation\n// const query = `SELECT * FROM users WHERE email = '${email}'`;\n\n// SECURE: Parameterized Prepared Statement\nconst result = await db.query(\n  'SELECT id, name, role FROM users WHERE email = $1 AND active = true',\n  [sanitizedEmail]\n);",
                  "language": "javascript"
                }
              ]
            }
          }
        ]
      },
      {
        "id": "mod-sec-2",
        "title": "Module 2: Applied Cryptography, PKI & Defense in Depth",
        "duration": "14 Hours",
        "lessons": [
          {
            "id": "les-sec-2-1",
            "title": "Symmetric AES-GCM, Asymmetric RSA/ECC, Hashing (Argon2id) & TLS 1.3",
            "type": "video",
            "duration": "50 mins",
            "summary": "Authenticated encryption, Elliptic Curve Diffie-Hellman (ECDH) key exchanges, forward secrecy, and secure password hashing algorithms.",
            "textbook": {
              "chapterNumber": "Chapter 2.1",
              "readingTime": "20 mins read",
              "keyTakeaways": [
                "Never use raw AES-CBC or ECB; always utilize Authenticated Encryption with Associated Data (AEAD) like AES-256-GCM or ChaCha20-Poly1305.",
                "Passwords must be hashed using memory-hard functions (Argon2id or bcrypt) with unique random cryptographic salts.",
                "TLS 1.3 achieves 1-RTT handshakes and enforces Perfect Forward Secrecy (PFS) by mandating ephemeral Diffie-Hellman key exchange."
              ],
              "sections": [
                {
                  "heading": "1. Modern Password Hashing with Argon2id",
                  "content": "Fast hashing functions (MD5, SHA-256) are disastrous for passwords because ASICs and modern GPUs compute billions of hashes per second. Argon2id incorporates both time cost (iterations) and memory cost (RAM hardness) to render GPU brute-force attacks economically and computationally infeasible.",
                  "code": "import * as argon2 from 'argon2';\n\n// Secure hash generation\nconst hash = await argon2.hash(userPassword, {\n  type: argon2.argon2id,\n  memoryCost: 2 ** 16, // 64 MB RAM\n  timeCost: 3,\n  parallelism: 1\n});",
                  "language": "javascript"
                }
              ]
            }
          }
        ]
      }
    ],
    "grandTest": {
      "totalQuestions": 10,
      "passingScore": 80,
      "timeLimit": 20,
      "questions": [
        {
          "id": "gt_sec_1",
          "level": "Level 1: Fundamentals",
          "topic": "SQL Injection",
          "question": "What is the only mathematically foolproof defense against SQL injection attacks?",
          "options": [
            "Parameterized prepared statements (parameter binding)",
            "Escaping single quotes with regex",
            "Blacklisting the word 'DROP'",
            "Using GET requests instead of POST"
          ],
          "correct": 0,
          "explanation": "Prepared statements decouple query compilation from parameter evaluation, ensuring untrusted input can never alter query execution syntax."
        },
        {
          "id": "gt_sec_2",
          "level": "Level 1: Fundamentals",
          "topic": "Password Security",
          "question": "Why is SHA-256 considered insecure for hashing user passwords?",
          "options": [
            "It is computationally too fast and lacks memory hardness, allowing GPUs to test billions of guesses per second",
            "It produces reversible plaintext",
            "It requires an internet connection",
            "It has known cryptographic collisions in the first 2 bits"
          ],
          "correct": 0,
          "explanation": "SHA-256 was designed for high-throughput data integrity verification, not password storage. Dedicated password algorithms like Argon2id or bcrypt require substantial memory and compute cycles per guess."
        },
        {
          "id": "gt_sec_3",
          "level": "Level 2: Architecture",
          "topic": "Cross-Site Scripting (XSS)",
          "question": "Which browser HTTP response header drastically mitigates XSS by strictly defining trusted script execution sources?",
          "options": [
            "Content-Security-Policy (CSP)",
            "X-Frame-Options",
            "Access-Control-Allow-Origin",
            "Strict-Transport-Security"
          ],
          "correct": 0,
          "explanation": "Content Security Policy (CSP) instructs the browser to block inline scripts, unapproved script domains, and unauthorized eval executions."
        },
        {
          "id": "gt_sec_4",
          "level": "Level 2: Architecture",
          "topic": "SSRF",
          "question": "In cloud environments (AWS, GCP, Azure), what is the primary target of an attacker executing Server-Side Request Forgery (SSRF)?",
          "options": [
            "The link-local Instance Metadata Service (IMDS at 169.254.169.254) to steal temporary IAM role credentials",
            "The company's marketing email newsletter",
            "The CSS stylesheet files",
            "The client's browser local storage"
          ],
          "correct": 0,
          "explanation": "SSRF attacks target `http://169.254.169.254/latest/meta-data/` to harvest temporary IAM credentials associated with the hosting virtual instance."
        },
        {
          "id": "gt_sec_5",
          "level": "Level 2: Practical",
          "topic": "Authentication Tokens",
          "question": "Why should session tokens and refresh JWTs be stored in `HttpOnly` and `SameSite=Strict` cookies rather than `localStorage`?",
          "options": [
            "HttpOnly cookies cannot be read or exfiltrated by malicious JavaScript during an XSS breach",
            "localStorage only holds 10 bytes",
            "Cookies travel faster across cables",
            "localStorage is cleared every 5 minutes"
          ],
          "correct": 0,
          "explanation": "The HttpOnly flag prevents client-side JavaScript access via `document.cookie`, preventing session hijacking even if an XSS vulnerability exists."
        },
        {
          "id": "gt_sec_6",
          "level": "Level 3: Advanced",
          "topic": "TLS & Forward Secrecy",
          "question": "What security guarantee does Perfect Forward Secrecy (PFS) provide in TLS communication?",
          "options": [
            "Compromising a server's long-term private key in the future does not allow decryption of past recorded session traffic",
            "Passwords never expire",
            "Websites load without domain name lookups",
            "Traffic is shielded from denial of service"
          ],
          "correct": 0,
          "explanation": "PFS generates unique ephemeral Diffie-Hellman keys for every TLS handshake; hence, leaking the long-term certificate private key does not compromise past recorded traffic."
        },
        {
          "id": "gt_sec_7",
          "level": "Level 3: Advanced",
          "topic": "Cryptographic Integrity",
          "question": "What is the primary advantage of AEAD (Authenticated Encryption with Associated Data) such as AES-GCM over unauthenticated AES-CBC?",
          "options": [
            "It simultaneously guarantees both confidentiality and ciphertext integrity/authenticity, preventing padding oracle attacks",
            "It encrypts text twice",
            "It does not require an encryption key",
            "It works without initialization vectors"
          ],
          "correct": 0,
          "explanation": "AEAD modes generate an authentication tag during encryption that detects any tampering or bit-flipping of ciphertext before decryption."
        },
        {
          "id": "gt_sec_8",
          "level": "Level 3: Advanced",
          "topic": "Network Reconnaissance",
          "question": "In Nmap, what does a SYN Stealth Scan (`-sS`) do differently than a full TCP Connect scan (`-sT`)?",
          "options": [
            "It sends a SYN packet and resets (RST) immediately upon receiving SYN-ACK, without completing the 3-way handshake",
            "It encrypts all packets with RSA",
            "It scans through Tor relays automatically",
            "It only checks UDP ports"
          ],
          "correct": 0,
          "explanation": "A SYN scan terminates the connection with RST before completion, avoiding connection logging on older firewall and application layer listeners."
        },
        {
          "id": "gt_sec_9",
          "level": "Level 3: Advanced",
          "topic": "Race Conditions",
          "question": "What vulnerability occurs when an application checks account balance and deducts funds in two distinct non-atomic database queries under concurrency?",
          "options": [
            "Time-of-Check to Time-of-Use (TOCTOU) race condition leading to double-spending",
            "Cross-Site Request Forgery",
            "Buffer Overflow",
            "Denial of Service via ping of death"
          ],
          "correct": 0,
          "explanation": "Non-atomic check-then-act operations enable concurrent threads to pass the balance validation check simultaneously before the deduction is finalized."
        },
        {
          "id": "gt_sec_10",
          "level": "Level 3: Advanced",
          "topic": "Zero Trust Architecture",
          "question": "What is the core foundational principle of a Zero Trust security architecture?",
          "options": [
            "'Never trust, always verify' - perimeter network location does not grant implicit access to internal resources",
            "All passwords must be 64 characters",
            "Only Windows computers can connect to the intranet",
            "Disable all firewalls and rely on antivirus software"
          ],
          "correct": 0,
          "explanation": "Zero Trust treats all network traffic as untrusted and continuously authenticates, authorizes, and encrypts all communications regardless of whether they originate inside or outside the corporate perimeter."
        }
      ]
    }
  },
  {
    "id": "course-mobile-engineering-flutter-reactnative",
    "title": "Cross-Platform Mobile Engineering (Flutter, React Native & Native Architecture)",
    "category": "mobile",
    "level": "Comprehensive",
    "duration": "46 Hours",
    "rating": 4.91,
    "enrolledCount": 1390,
    "instructor": "Lumixora Autonomous Academic Board & Mobile Engineering Architects",
    "badgeIcon": "📱",
    "badgeColor": "from-teal-500 to-emerald-600",
    "shortDescription": "Build production iOS & Android apps with modern Flutter (Dart) and React Native (Fabric architecture), state management, native bridging, and offline-first databases.",
    "certTitle": "Cross-Platform Mobile Engineering Mastery",
    "certCategory": "Mobile Engineering",
    "skills": [
      "Flutter & Dart Widget Tree Architecture",
      "React Native & New Architecture (Fabric/TurboModules)",
      "Offline-First Sync (WatermelonDB / Hive)",
      "Capacitor / Native App Shells & CI/CD Fastlane"
    ],
    "modules": [
      {
        "id": "mod-mob-1",
        "title": "Module 1: Flutter & Dart Architecture (Skia / Impeller Rendering)",
        "duration": "12 Hours",
        "lessons": [
          {
            "id": "les-mob-1-1",
            "title": "Flutter's Three Trees (Widget, Element, RenderObject) & Impeller Engine",
            "type": "video",
            "duration": "45 mins",
            "summary": "How Flutter draws directly to the GPU canvas using Impeller/Skia without platform OEM widget wrappers.",
            "textbook": {
              "chapterNumber": "Chapter 1.1",
              "readingTime": "18 mins read",
              "keyTakeaways": [
                "Widgets are immutable configurations; Elements manage lifecycle and mounting; RenderObjects handle layout and painting.",
                "Impeller eliminates shader compilation jank on iOS and Android by precompiling all shaders at engine build time.",
                "State management (Riverpod/Bloc) decouples business logic from the UI rendering tree."
              ],
              "sections": [
                {
                  "heading": "1. The Three Trees Architecture",
                  "content": "Flutter avoids the native OEM widget bridge altogether. The framework constructs an immutable Widget tree which diffs against a mutable Element tree. The Element tree coordinates the expensive RenderObject tree, which handles layout measurement, hit testing, and painting directly to GPU framebuffers at 60/120 FPS.",
                  "code": "import 'package:flutter/material.dart';\n\nclass EnterpriseHeaderCard extends StatelessWidget {\n  final String title;\n  const EnterpriseHeaderCard({super.key, required this.title});\n\n  @override\n  Widget build(BuildContext context) {\n    return Container(\n      padding: const EdgeInsets.all(16.0),\n      decoration: BoxDecoration(\n        color: const Color(0xFF101A35),\n        borderRadius: BorderRadius.circular(16.0),\n      ),\n      child: Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),\n    );\n  }\n}",
                  "language": "dart"
                }
              ]
            }
          }
        ]
      },
      {
        "id": "mod-mob-2",
        "title": "Module 2: React Native New Architecture & Native Hardware Bridging",
        "duration": "12 Hours",
        "lessons": [
          {
            "id": "les-mob-2-1",
            "title": "React Native Fabric, TurboModules, JSI & Capacitor Integration",
            "type": "video",
            "duration": "50 mins",
            "summary": "Direct C++ JavaScript Interface (JSI), synchronous TurboModule invocations, and Capacitor native web shells.",
            "textbook": {
              "chapterNumber": "Chapter 2.1",
              "readingTime": "20 mins read",
              "keyTakeaways": [
                "JavaScript Interface (JSI) replaces the asynchronous JSON serialization bridge with direct C++ pointer calls.",
                "Fabric enables synchronous UI layout and concurrent React 18/19 rendering features on mobile devices.",
                "Capacitor embeds web runtimes in native Android/iOS WebViews with high-performance native device plugin bridges."
              ],
              "sections": [
                {
                  "heading": "1. JSI and TurboModules Architecture",
                  "content": "In legacy React Native, all communication between JavaScript and native Java/Obj-C threads was batched and serialized into JSON over an asynchronous bridge. JSI exposes native C++ host objects directly to the JavaScript V8/Hermes engine, enabling synchronous, zero-copy method invocations.",
                  "code": "// Capacitor / Native Bridge invocation pattern\nimport { App } from '@capacitor/app';\nimport { Preferences } from '@capacitor/preferences';\n\nexport async function getSecureDeviceToken() {\n  const { value } = await Preferences.get({ key: 'auth_device_token' });\n  return value;\n}",
                  "language": "javascript"
                }
              ]
            }
          }
        ]
      }
    ],
    "grandTest": {
      "totalQuestions": 10,
      "passingScore": 80,
      "timeLimit": 20,
      "questions": [
        {
          "id": "gt_mob_1",
          "level": "Level 1: Fundamentals",
          "topic": "Flutter Rendering",
          "question": "How does Flutter render UI elements on the mobile screen?",
          "options": [
            "It draws directly to the screen using its own GPU rendering engine (Impeller/Skia) without native OEM widgets",
            "It translates Dart code to HTML DOM elements",
            "It compiles to native Android XML layouts and iOS Storyboards",
            "It runs inside a hidden Safari WebView"
          ],
          "correct": 0,
          "explanation": "Flutter renders pixels directly to the canvas using Impeller/Skia, granting pixel-perfect identical appearance across Android and iOS."
        },
        {
          "id": "gt_mob_2",
          "level": "Level 1: Fundamentals",
          "topic": "React Native Bridge",
          "question": "In the React Native New Architecture, what replaced the legacy asynchronous JSON bridge?",
          "options": [
            "JavaScript Interface (JSI) with direct C++ memory references",
            "WebSocket connections",
            "HTTP REST endpoints",
            "Android Intent broadcasts"
          ],
          "correct": 0,
          "explanation": "JSI allows JavaScript to hold direct references to host C++ objects, enabling synchronous and type-safe method invocation without JSON serialization overhead."
        },
        {
          "id": "gt_mob_3",
          "level": "Level 2: Architecture",
          "topic": "Flutter Element Tree",
          "question": "Which of Flutter's three trees is responsible for managing lifecycle and coordinating layout/render nodes?",
          "options": [
            "Element Tree",
            "Widget Tree",
            "RenderObject Tree",
            "Animation Tree"
          ],
          "correct": 0,
          "explanation": "Widgets are lightweight immutable configurations; the Element Tree holds the persistent state and manages the corresponding RenderObject in the hierarchy."
        },
        {
          "id": "gt_mob_4",
          "level": "Level 2: Architecture",
          "topic": "Shader Compilation Jank",
          "question": "What is the primary motivation behind Flutter's new Impeller rendering engine?",
          "options": [
            "Eliminating shader compilation stutter/jank by precompiling all shaders ahead of time",
            "Reducing Dart file sizes",
            "Allowing Flutter to write Kotlin code",
            "Supporting older Android 4.0 devices"
          ],
          "correct": 0,
          "explanation": "Impeller precompiles shaders during engine build, guaranteeing silky smooth 60/120 FPS animations without first-run compilation hitches."
        },
        {
          "id": "gt_mob_5",
          "level": "Level 2: Practical",
          "topic": "Offline-First Sync",
          "question": "In mobile architecture, which approach is best suited for offline-first data synchronization?",
          "options": [
            "Local embedded database (SQLite/Hive/WatermelonDB) with an append-only change log synced to the cloud via conflict resolution rules (CRDT / timestamp)",
            "Blocking the UI until internet is restored",
            "Writing files directly to the SIM card",
            "Polling the server every 10 milliseconds"
          ],
          "correct": 0,
          "explanation": "Offline-first apps write immediately to local databases and use event logs with conflict-free replicated data types (CRDTs) or version vectors to sync once online."
        },
        {
          "id": "gt_mob_6",
          "level": "Level 3: Advanced",
          "topic": "Mobile Memory Leaks",
          "question": "What is the most frequent cause of memory leaks in mobile applications?",
          "options": [
            "Unclosed event streams, listeners, or timers retaining references to disposed View/Component contexts",
            "Rendering images in PNG format",
            "Using async/await syntax",
            "Running apps on AMOLED screens"
          ],
          "correct": 0,
          "explanation": "If a singleton service or global listener maintains a strong reference to a disposed widget or activity context, garbage collection cannot reclaim its memory."
        },
        {
          "id": "gt_mob_7",
          "level": "Level 3: Advanced",
          "topic": "Capacitor Architecture",
          "question": "How does Capacitor differ from older Apache Cordova in its relationship with native platform projects?",
          "options": [
            "Capacitor commits and treats native Android and iOS folders as primary source artifacts rather than ephemeral build artifacts",
            "Capacitor cannot run on Android",
            "Capacitor requires Java Applets",
            "Capacitor does not support native plugins"
          ],
          "correct": 0,
          "explanation": "Capacitor encourages developers to check `android` and `ios` project directories into source control, providing transparent access to native Gradle/Xcode configurations."
        },
        {
          "id": "gt_mob_8",
          "level": "Level 3: Advanced",
          "topic": "Mobile CI/CD",
          "question": "Which open-source toolchain is the standard for automating mobile app code signing, screenshot generation, and store deployments (Google Play & Apple TestFlight)?",
          "options": [
            "Fastlane",
            "Docker Swarm",
            "Nginx",
            "Webpack"
          ],
          "correct": 0,
          "explanation": "Fastlane automates mobile release pipelines, managing certificates, provisioning profiles, app metadata, and binary uploads via a concise Fastfile script."
        },
        {
          "id": "gt_mob_9",
          "level": "Level 3: Advanced",
          "topic": "Battery Optimization",
          "question": "How does Android OS regulate background processing to preserve battery life?",
          "options": [
            "WorkManager with Doze Mode and App Standby Buckets throttling background execution",
            "Killing all apps after 10 seconds of screen lock",
            "Throttling screen refresh rate only",
            "Disabling RAM"
          ],
          "correct": 0,
          "explanation": "Android's WorkManager coordinates with Doze Mode and standby buckets to defer non-critical background jobs until maintenance windows when the device is charging."
        },
        {
          "id": "gt_mob_10",
          "level": "Level 3: Advanced",
          "topic": "Deep Linking",
          "question": "What technology allows verified HTTPS URLs to open specific application screens directly without an OS disambiguation dialog?",
          "options": [
            "Android App Links (Digital Asset Links) & Apple Universal Links",
            "Custom URL Schemes (e.g. `myapp://`)",
            "Bluetooth beacons",
            "Web cookies"
          ],
          "correct": 0,
          "explanation": "Universal Links and Android App Links verify ownership via a server-hosted `assetlinks.json` or `apple-app-site-association` file, opening links directly inside the app securely."
        }
      ]
    }
  }
];
