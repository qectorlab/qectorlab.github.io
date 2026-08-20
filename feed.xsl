<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html>
      <head>
        <title><xsl:value-of select="atom:feed/atom:title"/></title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          body{font-family:Inter,system-ui,sans-serif;background:#030712;color:#e2e8f0;max-width:42rem;margin:3rem auto;padding:0 1.5rem;line-height:1.6}
          h1{font-size:2rem;font-weight:800;color:#f1f5f9}
          a{color:#67e8f9;text-decoration:none}
          a:hover{text-decoration:underline}
          time{color:#94a3b8;font-size:0.85rem}
          ul{list-style:none;padding:0}
          li{padding:0.9rem 0;border-bottom:1px solid #1e2a45}
          p{color:#b6c2d2}
        </style>
      </head>
      <body>
        <h1><a href="{atom:feed/atom:link[@rel='alternate']/@href}"><xsl:value-of select="atom:feed/atom:title"/></a></h1>
        <p><xsl:value-of select="atom:feed/atom:subtitle"/></p>
        <ul>
          <xsl:for-each select="atom:feed/atom:entry">
            <li>
              <a href="{atom:link[@rel='alternate']/@href}"><xsl:value-of select="atom:title"/></a>
              <br/><time><xsl:value-of select="atom:updated"/></time>
              <p><xsl:value-of select="atom:summary"/></p>
            </li>
          </xsl:for-each>
        </ul>
        <p><a href="https://qector.store/">QECTOR</a></p>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>