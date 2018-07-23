---
layout: poster_list
title: Posters
---

# [](#header-1)My Projects
<ul>
  {% for post in site.categories['projects'] %}
      <li><a href="{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

# [](#header-1)Paper Reading
<ul>
  {% for post in site.categories['paper_reading'] %}
      <li><a href="{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>
