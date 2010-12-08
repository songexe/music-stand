#!/usr/bin/python

import cgi, cgitb

print 'Content-Type: text/html'
print

for x in range(4):
    name = '../' + str(x) + '.txt'
    f = open(name, 'w')
    f.close()

print 'Reset'
