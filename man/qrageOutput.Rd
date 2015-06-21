\name{qrageOutput}
\alias{qrageOutput}
\docType{methods}
\title{
Create a D3 JavaScript Force Directed Graph output element
}
\description{
Render a renderQrage within an application page. D3 JavaScript was created by Michael Bostock. See http://d3js.org/ and, more specifically for Force Directed Graph https://github.com/mbostock/d3/wiki/Force-Layout.
}
\usage{
qrageOutput(outputId,width='100\%',height='400px')
}
\arguments{
  \item{outputId}{output variable to read the graph object from}
  \item{width}{Width for the graph area in pixels. Defaults to '100\%'.}
  \item{height}{Height for the graph area in pixels. Defaults to 400px.}
}

\examples{
qrageOutput("d",width='100\%',height='400px')
}


