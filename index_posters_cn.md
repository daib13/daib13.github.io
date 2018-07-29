---
layout: poster_list_cn
title: 戴彬的博客
en: /index_posters
cn: /index_posters_cn
---

# [](#header-1)我的项目
<ul>
  {% for post in site.categories['projects_cn'] %}
      <li><a href="{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

# [](#header-1)论文阅读
<ul>
  {% for post in site.categories['paper_reading_cn'] %}
      <li><a href="{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

# [](#header-1)随笔（非学术相关）
<ul>
  {% for post in site.categories['informal_essay_cn'] %}
      <li><a href="{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>