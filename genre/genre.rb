#!/usr/bin/ruby
require 'mp3info'
require 'sinatra/base'

def mp3_genre path
  if File.readable?(path) && path.match(/\.mp3\Z/i)
    mp3 = Mp3Info.open(path)
    g = mp3.tag2.TCON
  else
    g= "Dance" 
  end
end

class Mp3App < Sinatra::Base
  set :logging,true
  set :sessions,true
  set :method_override, true
  set :inline_templates, true
  set :static, true
  set :haml, :format => :html5
  
  get '/' do
    "This here's a one trick pony. URL should have /dance?path=<path to mp3 file on the disk"
  end
  get '/dance' do
    g = mp3_genre params['path']
  end
end