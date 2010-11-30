#!/usr/bin/python

import cgi, cgitb
import simplejson

print 'Content-Type: text/html'
print

form = cgi.FieldStorage()
dat = simplejson.loads(form.getvalue('dat'))
pg = dat['pg']
del dat['pg']
d = simplejson.dumps(dat)

name = '../' + str(pg) + '.txt'
f = open(name, 'w')
f.write(d)
f.close()

print 'okay'
