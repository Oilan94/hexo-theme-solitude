'use strict';

const urlFor = require('hexo-util').url_for.bind(hexo)

const galleryBox = args => {
    const [name, descr, url, img] = args
    const imgUrl = urlFor(img)
    const urlLink = urlFor(url)

    return `<figure class="gallery-group">
  <img class="gallery-group-img no-lightbox" src='${imgUrl}' alt="Group Image Gallery">
  <figcaption>
  <div class="gallery-group-name">${name}</div>
  <p>${descr}</p>
  <a href='${urlLink}'></a>
  </figcaption>
  </figure>
  `
}

const gallery = (args, content) => {
    let html = ""
    const regex = /!\[(.*?)\]\(([^\s]*)\s*(?:["'](.*?)["']?)?\s*\)/g
    let m
    while ((m = regex.exec(content)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++
        }
        // 解析图片名称和地址（格式：名称|地址）
        const parts = m[1].split('|')
        const imageName = parts[0] || m[1]
        const imageAddress = parts[1] || '未知地点'
        
        html += `<div class="gallery-item">
          <img class="nolazyload" src=${m[2]} alt="${imageName}" />
          <div class="gallery-item-address">${imageAddress}</div>
          <div class="gallery-reply" onclick="sco.toTalk('${imageName}')" data-pjax-state>
            <i class="fas fa-comment"></i>
          </div>
        </div>`
    }
    return `<div class="gallery-container waterfall">
        ${html}
      </div>`
}

hexo.extend.tag.register('gallery', gallery, {ends: true})
hexo.extend.tag.register('galleryGroup', galleryBox)
