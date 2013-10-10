import urllib2

f = open('urls.txt')

for line in f:
    name = line.rstrip()

    try:
        urllib2.urlopen('http://'+name+'.tumblr.com')
    except urllib2.HTTPError, e:
        print(name + ".tumblr.com doesn't exist")
    except urllib2.URLError, e:
        print("Invalid URL: " + name + ".tumblr.com")