      {/* Milestones */}
      {campaign.milestones && campaign.milestones.length > 0 && (
        <section className="max-w-[800px] mx-auto px-6 pb-14">
          <h2 className="font-headline text-2xl font-bold text-navy mb-8">Timeline</h2>
          <div className="relative pl-6 space-y-8">
            <div className="absolute left-[5px] top-1 bottom-1 w-px bg-gray-200" />
            {[...campaign.milestones]
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((m, i) => (
                <div key={i} className="relative">
                  <div
                    className="absolute -left-[26px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white"
                    style={{ backgroundColor: '#E8192C' }}
                  />
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">
                    {new Date(m.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <h3 className="font-headline font-bold text-navy text-base mb-1">{m.title}</h3>
                  {m.description && (
                    <p className="text-sm text-gray-500 leading-relaxed">{m.description}</p>
                  )}
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Toolkit: media kit + hashtag feed */}
      {(campaign.media_kit_url || campaign.hashtag) && (
        <section className="border-t border-gray-100 py-14 px-6">
          <div className="max-w-[800px] mx-auto grid md:grid-cols-2 gap-8">
            {campaign.hashtag && (
              <div>
                <h2 className="font-headline text-xl font-bold text-navy mb-4">On social</h2>
                <CampaignTwitterFeed hashtag={campaign.hashtag} />
              </div>
            )}
            {campaign.media_kit_url && (
              <div>
                <h2 className="font-headline text-xl font-bold text-navy mb-4">Media kit</h2>
                
                  href={campaign.media_kit_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-gray-100 p-5 hover:border-gray-300 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-navy text-sm">Download press assets</p>
                    <p className="text-xs text-gray-400 mt-1">Logos, photos, and factsheet for this campaign</p>
                  </div>
                  <span style={{ color: '#E8192C' }}>→</span>
                </a>
              </div>
            )}
          </div>
        </section>
      )}
