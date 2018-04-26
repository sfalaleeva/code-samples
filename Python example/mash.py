## Stacy Falaleeva
## mash.py
## Final project for CSC 250 - Theory of Computation (Spring 2017)
## Professor: Joseph O'Rourke


##  Splits two text files into noun, verb and preposition phrases and
##  randomly puts them back together.
##  Project is aimed to show knowledge of regular language, regular expressions and
##  their limits when working with natural languages (in this case, English).
##  Better results could have been achieved with Python NLTK library, but for the purposes
##  of the project implementation was done by hand.


import nltk
from random import randint

def lengthcap(fp):
    ''' Cut text so it is faster to process'''
    fp = fp[:10000]

def first_lower(s):
    '''Turn all first letters into lowercase'''
    if len(s) == 0:
        return s
    else:
        return s[0].lower() + s[1:]

def cleanup(s):
    '''Clean up the string chunks from punctuation left over from original
    sentence'''
    sp_char = ".,!?:;-_'\|/&*()"
    if len(s) == 0:
        return s
    else:
        s = s.strip()
        if s[-1] in sp_char:
            s = s[:-1]
        if s[0] in sp_char:
            s = s[1:]
    return s

def process_tree(parse_tree, lists):
    '''Turn tree for each sentence into a list of chunks'''

    for i in range(len(parse_tree)):
        substr = ''
        subtree = parse_tree[i]
        if type(subtree) == nltk.tree.Tree:
            label = subtree.label()
            list_leaves = subtree.leaves()

        else:
            label = subtree[1]
            list_leaves = [subtree]
        for item in list_leaves:
            substr += item[0] + ' '

        substr = substr.strip()
        sort_chunks(label, substr, lists)


def sort_chunks(label, substr, lists):
    '''Sort chunks by their label into designated lists'''

    NPlist = lists[0]
    VPlist = lists[1]
    PPlist = lists[2]

    # based on the label from the parse tree, put in the correspoding list
    if label == 'NP':
        NPlist.append(substr)
    elif label == 'VP':
        VPlist.append(substr)
    elif label == 'PP':
        PPlist.append(substr)

def make_sents(lists):
    ''' Grammar:
    S --> <NP> <VP>
    NP --> <NP> <PP>?'''

    sent = ['S']        #start with S nonterminal
    cfg_replace(sent, 2)    #run through cfg to get final nonterminal string
    sent = replace(sent, lists) #replace all nonterminals with terminals from lists
    return sent

def cfg_replace(sent, depth):
    '''Replace nonterminals with other nonterminals, return final terminal string,
    function works specifically with the grammar described in make_sents'''
    
    if depth ==  0:
        quit

    else:
        for nonterm in sent:
            if nonterm == 'S':
                sent.remove(nonterm)
                sent.append('NP')
                sent.append('VP')
            # 50% probability that NP --> NP PP
            elif (nonterm == 'NP') & (randint(1,10) <= 5):
                i = sent.index(nonterm)
                sent.insert(i+1,'PP')

        cfg_replace(sent, depth-1)

def replace(sent, lists):
    '''Replace nonterminals with terminals from the corresponding lists'''
    
    NPlist = lists[0]
    VPlist = lists[1]
    PPlist = lists[2]

    # sentence must have NP and VP, if nothing is left in the lists
    # stop making sentences
    if (len(NPlist) > 0) & (len(VPlist) > 0):
        noun = randint(0, len(NPlist)-1)    #randomly pick an item from the list
        verb = randint(0, len(VPlist)-1)
    else:
        sent = []
        return sent

    # if PP list is not empty, pick one item from there
    # if empty, keep going
    if len(PPlist) > 0:
        pp = randint(0, len(PPlist)-1)
        
    #replace nonterminals
    for (i,item) in enumerate(sent):
        if item == 'NP':
            sent[i] = cleanup(NPlist[noun])
            del NPlist[noun]
        #if PP needed and have another PP in the list - replace
        #if don't have PP - skip (modify into NP VP sentence)
        elif (item == 'PP') :
            if (len(PPlist) > 0):
                sent[i] = PPlist[pp]
                del PPlist[pp]
            else:
                sent[i] = ''
        elif item == 'VP':
            sent[i] = cleanup(VPlist[verb])
            del VPlist[verb]
    return sent
            
                   

def main():
    '''Split text from file into gramatical structures,
    put them back together randomly using CFG'''

    #get filenames, open, red into the same file
    filename = input('Please enter the name of the file: ')
    filename2 = input('Please enter the name of the second file: ')
    fp = open(filename, 'r').read() + open(filename2, 'r').read()
    lengthcap(fp)   # make sure it's not too big to process

    # now sents is an array of sentences
    sents = nltk.sent_tokenize(fp)

    #grammar for chunking NP, VP and PP
    grammar = r"""
  NP: {<DT|PRP\$>?<JJ.?|VBG>*<NN.*>+}          # Chunk sequences of DT, JJ, NN
  NP: {<PRP>}
  PP: {<IN><NP>}               # Chunk prepositions followed by NP
  VP: {<RB.*>*<VB.>+<RP>*<RB.*|NP.*|PP>*<VB.*>*} # Chunk verbs and their arguments
  """
    cp = nltk.RegexpParser(grammar, loop = 4)
    lists = [[], [], []]
    new_text = ''

    # process all sentences
    for S in sents:

        S = first_lower(S.strip())
        words = S.split()   #list of words
        tagged = nltk.pos_tag(words)    #list of tuples [(word,tag)]

        parse_tree = cp.parse(tagged)
        process_tree(parse_tree, lists) #after this 

        new_sent = make_sents(lists) #new_sent is a list
        new_sent = (' ').join(new_sent).capitalize() + '.'  #make it into a string
        new_text += new_sent + ' '      #add it to the text string
    print(new_text)         #print final text 

main()



