---
layout: poster_list
title: Compressing Neural Networks Using the Variational Information Bottleneck
categories: projects
src: /blogs/20180720_icml2018_compression_imgs
---

<h2 align="center">{{page.title}}</h2>
<p>This poster introduces our work about compressing neural networks in a less formal fashion to help you gain a big picture of our work. For a formal version, please check our <a href="http://proceedings.mlr.press/v80/dai18d/dai18d.pdf" target="_blank">paper</a>. You can also refer to the <a href="https://arxiv.org/abs/1802.10399" target="_blank">arxiv version</a> for more technical details including all the proofs and mathematics.</p>

<h3>1. Outline</h3>
<ul>
  <li><a href="#background">Background</a></li>
  <li><a href="#intuition">High level intuition</a></li>
  <li><a href="#objective">Objective derivation</a></li>
  <li><a href="#theory">Theoretical analysis</a></li>
  <li><a href="#experiment">Empirical results</a></li>
  <li><a href="#related">Related work</a></li>
  <li><a href="#video">ICML 2018 oral</a></li>
</ul>
<p>If you are not interested in the theoretical/mathematical part, you can skip the objective derivation part and the theoretical analysis part. Though mathematical derivations are unavoidable in the theoretical analysis part, I will try my best to make it as simple as possible and give you an intuitive sense.</p>

<h3 id="background">2. Background</h3>
<p>Though deep learning is very successful in many application domains, it is also well-known that most of the popular networks are over-parameterized. The consequence of over-parameterization is often three-fold:
  <ul>
    <li>Unnecessarily large model size,</li>
    <li>Computational cost,</li>
    <li>Run-time memory footprint.</li>
  </ul>
In this work, we try to compress the network in all the three aspects. Basically, the proposed method is a pruning method (check <a href="#related">related work</a> for other methods). We have an over-parameterized model. Then we use some kinds of regularization to prune the original model and obtain a much smaller one. In the literature, there are two kinds of pruning methods. The first one only prunes weight connections, as shown in Figure 1 while the second one prunes weight groups or neurons / filters, as shown in Figure 2.</p>

<div align="center">
  <img width="100%" src="{{page.src}}/prune_connection.png"/>
  <div class="caption">Figure 1. Illustration of Pruning Weight Connections.</div>
  <img width="100%" src="{{page.src}}/prune_group.png"/>
  <div class="caption">Figure 2. Illustration of Pruning Weight Groups / Neurons / Filters.</div>
</div>


<h3 id="intuition">3. High Level Intuition</h3>
<p>We first interpret feed forward networks as a Markov chain, as shown in Figure 3(a). The input is $x$ while the target output (usually the label) is $y$. The hidden layers are denoted as $h_1, h_2, ..., h_L$ where $L$ is the number of layers. Sometimes we also denote the input layer as $h_0$ for convenience. The $i$-th layer defines the probability distribution $p(h_i|h_{i-1})$. If this distribution becomes a Dirac-delta function, then the network becomes deterministic. In the proposed model, we consider non-degenerate distributions of $p(h_i|h_{i-1})$. The last layer approximates $p(y|h_L)$ via some tractable alternative $p(\hat{y}|h_L)$. In the network, each layer extracts information from its previous layer. The last layer uses the information it extracted to give the prediction. Intuitively speaking, the more useful information it extracted, the higher predicting accuracy it will be.</p>

<div align="center">
  <img width="100%" src="{{page.src}}/markov_chain.png"/>
  <div class="caption">Figure 3.</div>
</div>

<p>We take Figure 3(b) an example. We have a label ($y$) "cat" and an input image ($x$). The hidden layers extracts a lot of information about the input image. For example, the color, the animal type, the location, the moode and so on. The output layer tries to use these information to output the animal type <em>i.e.</em> "cat". However, we can see most of the information extracted by the hidden layers is actually irrelevant to our task, which means there is a huge room for us to compress the network. Our high level intuition to compress the network is</p>
  <ul>
    <li><strong>Only extract relevant information for our task;</strong></li>
    <li><strong>Aggregate the relevant information to part of the network such that the rest part of the network can be pruned.</strong></li>
  </ul>
<p>For the first intuition, we use an information bottleneck, which is first proposed by Tishby et al. (2000), to enforce each layer only extracting the relevant information about the task. That is</p>
  <ul>
    <li><strong>Maximize the mutual information between $h_i$ and $y$, <em>i.e.</em> $I(h_i; y)$;</strong></li>
    <li><strong>Minimize the mutual information between $h_i$ and $h_{i-1}$, <em>i.e.</em> $I(h_i; h_{i-1})$.</strong></li>
  </ul>
<p>So the layer-wise energy function becomes
<strong>$$\mathcal{L}_i=\gamma_iI(h_i;h_{i-1})-I(h_i;y),$$</strong>
where $\gamma_i$ is a hyper parameter that controls the bottleneck strength. If a layer $h_i$ extracts some irrelevant information about $y$, we can decrease the energy $\mathcal{L}_i$ by removing this part of information, which will not change $I(h_i;y)$ but decrease $I(h_i;h_{i-1})$. As shown in Figure 3(c), the proposed method uses an information bottleneck to filter out the irrelevant information and only let the relevant part to go through. We aggregate the relevant information to only part of the network by using a sparse-promote prior on each hidden neurons. You can see the details in the <a href="#objective">objective derivation</a> section. If you are not interested in mathematics, you can directly go to the end of the next section and check the final practical objective function and the network structure.
</p>

<h3 id="objective">4. Objective Derivation</h3>
<p>The layer-wise energy defined above is often intractable in a deep neural network. So instead of optimizing it directly, we optimize an upper bound of it. Basically we use variational distributions which can be defined by the network to approximate the true distributions and obtain the upper bound according to Jensen's inequalicy. Take the mutual information between $h_i$ and $h_{i-1}$ for example, we have
$$\begin{align}I(h_i;h_{i-1}) &= \int p(h_i,h_{i-1}) \log \frac{p(h_i,h_{i-1})}{p(h_i)p(h_{i-1})} dh_i dh_{i-1} \\
 &= \int p(h_{i-1}) p(h_i|h_{i-1}) \log \frac{p(h_i|h_{i-1})}{p(h_i)} dh_i dh_{i-1} \\
 &\le \mathbb{E}_{h_{i-1}\sim p(h_{i-1})} \left[ \mathbb{KL}\left[ p(h_i|h_{i-1}) || q(h_i) \right] \right]. \end{align}$$
The inequality comes from Jesen's inequality by replacing $p(h_i)$ with a variational distribution $q(h_i)$ and it holds for any kind of distribution. The final upper bound is
$$\begin{align} \tilde{\mathcal{L}}_i = & \gamma_i \mathbb{E}_{\{x,y\}\sim\mathcal{D}, h_i \sim p(h_i|x)} \left[ \mathbb{KL}\left[ p(h_i|h_{i-1}) || q(h_i) \right] \right] \\
 & -\mathbb{E}_{\{x,y\}\sim\mathcal{D}, h\sim p(h|x)} \left[ \log q(y|h_L) \right], \end{align}$$
where $\mathcal{D}$ is the data distribution and $h$ stands for the union of $h_1, h_2, ..., h_L$.</p>

<p>We then need to specify the parameterization of the probability distributions in the upper bound. More specifically, we need to parameterize three distributions: $p(h_i|h_{i-1})$, $q(h_i)$ and $q(y|h_L)$. For other distributions in the upper bound, $\mathcal{D}$ is the groundtruth distribution of the given dataset, $p(h_i|x)$ (or $p(h_i|h_0)$) can be written as the marginalization of $\Pi_{j=1}^{i} p(h_j|h_{j-1})$ while $p(h|x)$ can be simply written as $\Pi_{j=1}^{L} p(h_j|h_{j-1})$.</p>

<p>The parameterization of $q(y|h_L)$ is quite straight-forward. It is a multinomial distribution for a classification task and produces a cross-entropy loss. For a regression task, it becomes a Gaussian distribution and gives a Euclidean loss. We define both $p(h_i|h_{i-1})$ and $q(h_i)$ as Gaussian distributions as follows
$$\begin{align} p(h_i|h_{i-1}) &\sim \mathcal{N} \left(f_i(h_{i-1})\odot\mu_i, \text{diag}\left[ f_i(h_{i-1})^2\odot\sigma_i^2 \right] \right), \\
q(h_i) &\sim \mathcal{N} \left( 0, \text{diag}\left[ \xi_i \right] \right). \end{align}$$
</p>

<h3 id="theory">5. Theoretical Analysis</h3>

<h3 id="experiment">6. Empirical Results</h3>

<h3 id="related">7. Related work</h3>

<h3 id="video">8. ICML 2018 Oral</h3>
<div align="center">
<video width="100%" max-width="640px" controls="controls" align="center">
  <source src="/posters/icml2018_compressing_video.mp4" type="video/mp4" />
</video>
</div>

<h4 id="reference">Reference</h4>
[1] Tishby, N., Pereira, F. C., and Bialek, W. The information bottleneck method. arXiv:physics/0004057, 2000.