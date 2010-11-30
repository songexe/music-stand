#!/usr/bin/python

import cgi, cgitb
import simplejson

print 'Content-Type: application/json'
print 

form = cgi.FieldStorage()
pg = form.getvalue('pg')

file = '../' + pg + '.txt'

f = open(file, 'r')
js = f.read()
f.close()

print js
