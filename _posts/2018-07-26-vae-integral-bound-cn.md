---
layout: poster_list_cn
title: 	基于KL和Renyi积分上界的变分自编码器学习（Learning in Variational Autoencoders with Kullback-Leibler and Renyi Integral Bounds）
categories: paper_reading_cn
src: /blogs/20180726_vae_integral_bound_imgs
en: /paper_reading/2018/07/26/vae-integral-bound
cn: /paper_reading_cn/2018/07/26/vae-integral-bound-cn
---

<h2 align="center">{{page.title}}</h2>
<p>This is an interesting workshop paper in ICML 2018 about variational autoencoders (VAE). I will introduce its main idea and some of my thinkings about this paper.</p> 

<h3>Background</h3>
<p>Denote the input variable as $x$ and the latent variable as $z$. The decoder models the conditional probability distribution $p(x|z)$. Usually we assume the prior of $z$ is a normal Gaussian distribution. If the data distribution $p(x)$ is continuous, $p_\theta(x|z)$ is often defined as a parameterized Gaussian distribution $\mathcal{N}(x|\mu_x(z;\theta),\text{diag}[\sigma_x(z;\theta)])$. The goal of VAE is to optimize the log likelihood
$$-\log p_\theta(x) = -\log \int p_\theta(x|z)p(z) dz.$$
However, because this objective is intractable, we instead optimize an upper bound of it
$$\mathcal{L} = \mathbb{KL}[q_\phi(z|x)||p_\theta(z|x)] - \mathbb{E}[\log p_\theta(x|z)],$$
where $q_\phi(z|x)$ is any kind of variational distributions defined by the encoder. For more details about VAE, refer to my <a href="/paper_reading/2018/07/25/vae">poster</a>.</p>

<h3>Drawback of VAE</h3>
<p>One drawback of VAE is that sometimes the deviation given by the decoder $\sigma_x$ is very close to $0$. This is because $x$ usually lies in a low-dimensional manifold in the ambient space. The groundtruth probability density is $0$ off the manifold and infinite in the manifold. As </p>