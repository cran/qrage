\name{qrage}
\alias{qrage}
\docType{methods}
\title{
Create a D3 JavaScript Force Directed Graph
}
\description{
Create a D3 JavaScript Force Directed Graph. D3 JavaScript was created by Michael Bostock. See http://d3js.org/ and, more specifically for Force Directed Graph https://github.com/mbostock/d3/wiki/Force-Layout.
}
\usage{
qrage(links, width = 1400, height = 1000,distance=6000,nodeValue=NULL
        ,nodeColor=NULL,linkColor='#00f',arrowColor='#f00',cut=0.25,textSize=12
        ,linkWidth=c(1,10),nodeSize=c(5,20),linkOpacity=c(0.1,1)) 
}
\arguments{
  \item{links}{A data frame object with the links between the nodes. It should include the source and the target and the value for each link. The value in the links is the variable for determining the relative distance between the nodes. Distance of between the nodes becomes shorter as the value is large.}
  \item{nodeColor}{A data frame object that determine the color of each nodes. It should include the name and the nodeColor. Defaults to NULL.}
  \item{nodeValue}{A data frame object that determine the relative size of each nodes. It should include the name and the nodeValue. Defaults to NULL.}
  \item{distance}{Numeric that determine the distance between the links in pixels. The value of the links is converted from 0 to 100, and multiplies the reciprocal of converted value and thie argument, the result is used as the distance between nodes. Defaults to 6000.}
  \item{cut}{Numeric to limit the number of records links. links data frame will be limited to records that has value which bigger than value which is multiplication value this argument and the links's maximum value. Defaults to 0.25.}
  \item{width}{Width for the graph area in pixels. Defaults to 1400.}
  \item{height}{Height for the graph area in pixels. Defaults to 1000.}
  \item{linkColor}{Character string specifying the color you want the link lines to be. Defaults to #00f.}
  \item{arrowColor}{Character string specifying the color you want the link arrows to be. Defaults to #f00.}
  \item{textSize}{Numeric specifying the size you want the labels of node to be. Defaults to 12.}
  \item{linkWidth}{Width range of the link lines in pixels. Defaults to from 1 to 10.}
  \item{nodeSize}{Size range of the nodes in pixels. Defaults to from 5 to 20.}
  \item{linkOpacity}{Numeric specifying the opacity range you want the link lines to be. Defaults to from 0.1 to 1.}
}
\examples{
#Data to determine the connection between the nodes
data(links)

#Data that determines the color of the nodes
data(nodeColor)

#Data that determines the size of the node
data(nodeValues)

#Create graph
qrage(links=links,nodeColor=nodeColor,nodeValue=nodeValues,cut=0.1)
}
